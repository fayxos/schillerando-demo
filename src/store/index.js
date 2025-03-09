import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import router from '../router';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '@/database';

const store = createStore({
  state: {
    user: null,
    session: null,
    state: undefined,
    error: null,
    shoppingCart: [],
    access_token: null,
    refresh_token: null,
    orders: [],
    registered: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setState(state, payload) {
      state.state = payload;
    },
    addProductToCart(state, payload) {
      const index = state.shoppingCart.findIndex((p) => {
        return (
          p.id == payload.id &&
          p.variation == payload.variation &&
          JSON.stringify(
            p.picked_extras == undefined ? [] : p.picked_extras.sort()
          ) ===
            JSON.stringify(
              payload.picked_extras == undefined
                ? []
                : payload.picked_extras.sort()
            )
        );
      });

      if (index != -1) {
        if (state.shoppingCart[index].count < 9)
          state.shoppingCart[index].count++;
      } else {
        state.shoppingCart.push(payload);
      }
    },
    removeProductFromCart(state, payload) {
      state.shoppingCart = state.shoppingCart.filter((product) => {
        return !(
          product.id == payload.id &&
          product.variation == payload.variation &&
          JSON.stringify(
            product.picked_extras == undefined
              ? []
              : product.picked_extras.sort()
          ) ===
            JSON.stringify(
              payload.picked_extras == undefined
                ? []
                : payload.picked_extras.sort()
            )
        );
      });
    },
    removeOneProductFromCart(state, payload) {
      const index = state.shoppingCart.findIndex((p) => {
        return (
          p.id == payload.id &&
          p.variation == payload.variation &&
          JSON.stringify(
            p.picked_extras == undefined ? [] : p.picked_extras.sort()
          ) ===
            JSON.stringify(
              payload.picked_extras == undefined
                ? []
                : payload.picked_extras.sort()
            )
        );
      });

      if (index != -1) {
        state.shoppingCart[index].count--;

        if (state.shoppingCart[index].count == 0) {
          state.shoppingCart = state.shoppingCart.filter((product) => {
            return !(
              product.id == payload.id &&
              product.variation == payload.variation &&
              JSON.stringify(
                product.picked_extras != null
                  ? product.picked_extras.sort()
                  : null
              ) ===
                JSON.stringify(
                  payload.picked_extras != null
                    ? payload.picked_extras.sort()
                    : null
                )
            );
          });
        }
      }
    },
    setOrders(state, payload) {
      state.orders = payload;
    },
    setRegistered(state, payload) {
      state.registered = payload;
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getState(state) {
      return state.state;
    },
    getProductsInCart(state) {
      return state.shoppingCart;
    },
    getOrders(state) {
      return state.orders;
    },
  },
  actions: {
    async reload({ commit }) {
      const users = await executeQuery('SELECT * FROM users');

      if(users.length > 0 && users[0].logged_in == true) {
        commit('setUser', users[0]);
      } else {
        commit('setUser', null);
      }

      // var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      // isSafari = true;

      // try {
      //   if (error || data.session == null) {
      //     if (isSafari) {
      //       commit('setUser', null);
      //     } else this.dispatch('getSharedLogin');

      //     this.state.access_token = null;
      //     this.state.refresh_token = null;
      //   } else {
      //     this.state.access_token = data.session.access_token;
      //     this.state.refresh_token = data.session.refresh_token;

      //     commit('setUser', data.user);

      //     if (
      //       data.user.user_metadata.isInDatabase == null ||
      //       data.user.user_metadata.isInDatabase == false
      //     )
      //       this.dispatch('addToDatabase');
      //     this.dispatch('checkUserCompany');
      //     this.dispatch('startOrderSubscription');
      //   }
      // } catch (e) {
      //   commit('setUser', null);

      //   this.state.access_token = null;
      //   this.state.refresh_token = null;
      // }

      // if (!isSafari) {
      //   this.timer = setInterval(() => {
      //     this.dispatch('getSharedLogin');
      //   }, 1000);
      // }
    },
    // async getSharedLogin({ commit }) {
      // const cookies = document.cookie
      //   .split(/\s*;\s*/)
      //   .map((cookie) => cookie.split('='));
      // const accessTokenCookie = cookies.find(
      //   (x) => x[0] == 'supabase-access-token'
      // );
      // const refreshTokenCookie = cookies.find(
      //   (x) => x[0] == 'supabase-refresh-token'
      // );
      // if (accessTokenCookie && refreshTokenCookie) {
      //   if (this.getters.getUser != null) return;

      //   const { data, error } = await supabase.auth.setSession({
      //     access_token: accessTokenCookie[1],
      //     refresh_token: refreshTokenCookie[1],
      //   });

      //   if (error || data.session == null) {
      //     commit('setUser', null);

      //     document.cookie = `supabase-access-token=false;`;
      //     document.cookie = `supabase-refresh-token=false;`;
      //   } else {
      //     if (this.getters.getUser != null) {
      //       commit('setUser', data.user);

      //       this.dispatch('checkUserCompany');
      //     } else {
      //       commit('setUser', data.user);

      //       this.dispatch('checkUserCompany');

      //       router.go(router.currentRoute);
      //     }
      //   }
      // } else if (this.getters.getUser != null) {
      //   commit('setUser', null);
      //   router.go(router.currentRoute);
      // } else {
      //   commit('setUser', null);
      // }
    // },
    // async addToDatabase() {
      // try {
      //   const { error } = await supabase.from('users').insert({
      //     id: this.state.user.id,
      //     email: this.state.user.email,
      //     name: this.state.user.user_metadata.name,
      //   });

      //   if (error) throw error;

      //   {
      //     const { error } = await supabase.auth.updateUser({
      //       data: { isInDatabase: true },
      //     });

      //     if (error) throw error;
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    // },
    // eslint-disable-next-line no-empty-pattern
    async externLoginCallback({}, path) {
      window.location.replace(
        process.env.VUE_APP_BUSINESS_URL +
          path +
          '?ext=true&id=' +
          store.state.user.id +
          '&name=' +
          store.state.user.name + 
          '&email=' +
          store.state.user.email
      );
    },
    // eslint-disable-next-line no-empty-pattern
    async internLoginCallback({}, path) {
      var p = '';
      if (path != undefined && path != null && path != '/') p = path;

      window.location.replace(
        process.env.VUE_APP_INTERN_URL +
          p +
          '?int=true&id=' +
          store.state.user.id +
          '&name=' +
          store.state.user.name + 
          '&email=' +
          store.state.user.email
      );
    },
    async signInAction({ commit }, { form, path }) {
      commit('setState', 'loading');

      const users = await await executeQuery("SELECT * FROM users WHERE email='" + form.email + "'");

      if(users.length > 0) {
        commit('setUser', users[0]);
        console.log('Successfully signed in');
        commit('setState', 'success');
        this.dispatch('checkUserCompany');

        if (path == null) await router.replace('/account');
        else if (path.includes('ext')) {
          this.dispatch('externLoginCallback', path.split('_')[1]);
        } else if (path.includes('int')) {
          this.dispatch('internLoginCallback', path.split('_')[1]);
        } else await router.replace(path);
      } else {
        commit('setState', 'failure');
      }

      // try {
      //   commit('setState', 'loading');

      //   const { data, error } = await supabase.auth.signInWithPassword({
      //     email: form.email,
      //     password: form.password,
      //   });
      //   if (error) throw error;
      //   console.log('Successfully signed in');
      //   commit('setUser', data.user);
      //   this.dispatch('checkUserCompany');

      //   commit('setState', 'success');

      //   this.state.access_token = data.session.access_token;
      //   this.state.refresh_token = data.session.refresh_token;

      //   if (path == null) await router.replace('/account');
      //   else if (path.includes('ext')) {
      //     this.dispatch('externLoginCallback', path.split('_')[1]);
      //   } else if (path.includes('int')) {
      //     this.dispatch('internLoginCallback', path.split('_')[1]);
      //   } else await router.replace(path);
      // } catch (error) {
      //   commit('setState', 'failure');
      //   console.log(error.error_description || error.message);
      // }
    },

    async signUpAction({ commit }, { form, path }) {
      try {
        commit('setState', 'loading');

        const splitBySpace = form.name.split(' ');
        let formattedName = '';
        for (let i = 0; i < splitBySpace.length; i++) {
          let splitByHyphen = splitBySpace[i].split('-');
          let subName = '';
          for (let j = 0; j < splitByHyphen.length; j++) {
            if (splitByHyphen[j].toLowerCase() === 'von') subName += 'von-';
            else if (splitByHyphen[j].toLowerCase() === 'zu') subName += 'zu-';
            else
              subName +=
                splitByHyphen[j].charAt(0).toUpperCase() +
                splitByHyphen[j].slice(1).toLowerCase() +
                '-';
          }
          subName = subName.slice(0, subName.length - 1);
          formattedName += subName + ' ';
        }
        formattedName.slice(0, -1);

        await executeQuery("INSERT INTO users VALUES ('" + uuidv4() + "','" + formattedName + "','" + form.email + "'," + true + ")")

        // const { data, error } = await supabase.auth.signUp({
        //   email: form.email,
        //   password: form.password,
        //   options: {
        //     emailRedirectTo: 'https://schillerando.de/account',
        //     data: {
        //       name: formattedName,
        //       isInDatabase: true,
        //       isCompanyLeader: false,
        //     },
        //   },
        // });

        // if (error) throw error;

        // {
        //   const { error } = await supabase.from('users').insert({
        //     id: data.user.id,
        //     email: data.user.email,
        //     name: formattedName,
        //   });

        //   if (error) throw error;
        // }

        const users = await executeQuery("SELECT * FROM users where email='" + form.email + "'");

        console.log('Successfully registered');
        commit('setUser', users[0]);
        commit('setRegistered', true);

        commit('setState', 'success');

        this.dispatch('checkUserCompany');

        console.log(path);

        if (path == null) await router.replace('/account');
        else if (path.includes('ext')) {
          this.dispatch('externLoginCallback', path.split('_')[1]);
        } else await router.replace(path);
      } catch (error) {
        this.state.error = error;
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async signOutAction({ commit }) {
      try {
        console.log("Test")

        commit('setState', 'loading');

        await executeQuery("UPDATE users SET logged_in=false")

        // const { error } = await supabase.auth.signOut();
        // if (error) throw error;
        // commit('setUser', null);
        // console.log('Logged Out successfully');

        commit('setState', 'success');

        this.state.access_token = null;
        this.state.refresh_token = null;

        await router.replace('/auth');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async resetPasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading');
        // const { error } = await supabase.auth.resetPasswordForEmail(
        //   form.email,
        //   {
        //     redirectTo: process.env.VUE_APP_MAIN_URL + '/update-password',
        //   }
        // );
        // if (error) throw error;

        const users = await executeQuery("SELECT * FROM users WHERE email='" + form.email + "'");

        if(users.length > 0) {
          window.location.replace(
            process.env.VUE_APP_MAIN_URL +
              '/update-password'
          );
  
          commit('setState', 'success');
        } else {
          commit('setState', 'failure');
        }
        
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },
    async updatePasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading');

        // const { error } = await supabase.auth.updateUser({
        //   password: form.password,
        // });
        // if (error) throw error;
        console.log(form.password)

        commit('setState', 'success');

        await router.replace('/account');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async checkUserCompany({ commit }) {
      try {
        const companies = await executeQuery("SELECT * FROM companies WHERE user_uid='"+ this.getters.getUser.id + "'")

        // const { data, error } = await supabase
        //   .from('companies')
        //   .select()
        //   .or(
        //     'user_uid.eq.' +
        //       this.getters.getUser.id +
        //       ',employees.cs.' +
        //       '{"' +
        //       this.getters.getUser.email +
        //       '"}'
        //   );

        // if (error) throw error;

        let user = this.getters.getUser;
        user.hasCompany = false;
        commit('setUser', user);
        if (companies.length == 0) return;

        user.hasCompany = true;
        commit('setUser', user);
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },
    async order({ commit }, order) {
      var hasActiveOrder = false;

      this.state.orders.forEach((order) => {
        if (order.delivery_time == null) hasActiveOrder = true;
      });

      if (hasActiveOrder) {
        commit('setState', 'failure');
        return;
      }

      try {
        commit('setState', 'loading');

        // const productIds = [];

        console.log(order.products);

        // var id = uuidv4()

        //TODO

        // const { error } = await supabase.from('orders').insert({
        //   id: id,
        //   buyer: this.state.user.id,
        //   deliver_to: order.deliver_to,
        //   products: productIds,
        //   order_price: order.totalPrice,
        //   note: order.note,
        //   payed: false,
        //   delivered: false,
        //   buyer_name: this.state.user.user_metadata.name,
        // });

        // if (error) throw error;

        // order.products.forEach(async (product) => {
        //   var productId = uuidv4()

        //   const { error } = await supabase.from('order_products').insert({
        //     id: productId,
        //     order: id,
        //     product: product.id,
        //     variation: product.variation,
        //     extras:
        //       product.picked_extras != undefined ? product.picked_extras : null,
        //     count: product.count,
        //     price: product.price,
        //     buyer: this.state.user.id,
        //   });

        //   if (error) throw error;

        //   productIds.push(productId);
        // });

        store.state.shoppingCart = [];
        commit('setState', 'success');

        router.replace('ordered');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },
    // async startOrderSubscription({ commit }) {
    //   try {
    //     const { data, error } = await supabase
    //       .from('orders')
    //       .select()
    //       .eq('buyer', this.state.user.id);

    //     console.log(data);

    //     if (error != null) throw error;

    //     var orders = data;

    //     this.state.orders.sort((a, b) => {
    //       var longA = a.day + a.order_time;
    //       var longB = b.day + b.order_time;

    //       return longA.localeCompare(longB);
    //     });

    //     {
    //       const { data, error } = await supabase
    //         .from('order_products')
    //         .select()
    //         .eq('buyer', this.state.user.id);

    //       if (error) throw error;

    //       console.log(data);

    //       data.forEach((product) => {
    //         var index = orders.findIndex((o) => o.id == product.order);

    //         if (index != -1) {
    //           if (orders[index].order_products == undefined)
    //             orders[index].order_products = [];
    //           orders[index].order_products.push(product);
    //         }
    //       });
    //     }

    //     commit('setOrders', orders);

    //     const orderSubscription = supabase.channel('any').on(
    //       'postgres_changes',
    //       {
    //         event: '*',
    //         schema: 'public',
    //         table: 'orders',
    //         filter: 'buyer=eq.' + this.state.user.id,
    //       },
    //       async (payload) => {
    //         var orders = this.state.orders;

    //         var index = orders.findIndex((order) => order.id == payload.new.id);

    //         if (index != -1) {
    //           var newOrder = payload.new;

    //           newOrder.order_products = orders[index].order_products;

    //           orders[index] = newOrder;
    //         } else orders.push(payload.new);

    //         if (error != null) throw error;

    //         console.log('Database change received!', payload.new);
    //         commit('setOrders', orders);

    //         this.state.orders.sort((a, b) => {
    //           var longA = a.day + a.order_time;
    //           var longB = b.day + b.order_time;

    //           return longA.localeCompare(longB);
    //         });
    //       }
    //     );

    //     orderSubscription.subscribe();
    //   } catch (error) {
    //     commit('setOrders', []);
    //     console.log(error.error_description || error.message);
    //   }
    // },

    // async stopOrderSubscription() {
    //   try {
    //     await supabase.removeAllChannels();
    //   } catch (error) {
    //     console.log(error.error_description || error.message);
    //   }
    // },
    // // eslint-disable-next-line no-empty-pattern
    // async addQRCodeCount({}, id) {
    //   try {
    //     const { data, error } = await supabase
    //       .from('stats')
    //       .select()
    //       .eq('id', id);

    //     if (error) throw error;
    //     if (data[0] == null) throw error;

    //     var count = data[0].count;
    //     {
    //       const { error } = await supabase
    //         .from('stats')
    //         .update({
    //           count: count + 1,
    //         })
    //         .eq('id', id);

    //       if (error) throw error;
    //     }
    //     console.debug(
    //       'Updated stats: ID is: ' + id + '; count before was: ' + count
    //     );
    //   } catch (error) {
    //     console.error(
    //       'Error updating QR code stat',
    //       error.error_description || error.message
    //     );
    //   }
    // },
  },

  modules: {},

  plugins: [createPersistedState()],
});

export default store;
