import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import router from '../router';
import { supabase } from '../supabase';

const store = createStore({
  state: {
    user: null,
    refresh: true,
    session: null,
    state: undefined,
    shoppingCart: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setRefresh(state, payload) {
      state.refresh = payload;
    },
    setState(state, payload) {
      state.state = payload;
    },
    addProductToCart(state, payload) {
      state.shoppingCart.push(payload);
    },
    removeProductFromCart(state, payload) {
      state.shoppingCart.filter((product) => product.id != payload.id);
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getRefresh(state) {
      return state.refresh;
    },
    getState(state) {
      return state.state;
    },
    getProductsInCart(state) {
      return state.shoppingCart;
    },
  },
  actions: {
    async reload({ commit }) {
      commit('setRefresh', true);
      const { data, error } = await supabase.auth.refreshSession();

      if (error || data.session == null) {
        this.dispatch('getSharedLogin');
      } else {
        commit('setUser', data.user);

        this.dispatch('updateMissingMetadata');
        this.dispatch('checkUserCompany');
      }

      this.timer = setInterval(() => {
        this.dispatch('getSharedLogin');
      }, 1000);
    },
    async getSharedLogin({ commit }) {
      const cookies = document.cookie
        .split(/\s*;\s*/)
        .map((cookie) => cookie.split('='));
      const accessTokenCookie = cookies.find(
        (x) => x[0] == 'supabase-access-token'
      );
      const refreshTokenCookie = cookies.find(
        (x) => x[0] == 'supabase-refresh-token'
      );
      if (accessTokenCookie && refreshTokenCookie) {
        if (this.getters.getUser != null) return;
        if (!this.getters.getRefresh) return;

        const { data, error } = await supabase.auth.setSession({
          access_token: accessTokenCookie[1],
          refresh_token: refreshTokenCookie[1],
        });

        if (error || data.session == null) {
          commit('setUser', null);
          commit('setRefresh', false);
        } else {
          commit('setUser', data.user);

          this.dispatch('updateMissingMetadata');
          this.dispatch('checkUserCompany');

          router.go(router.currentRoute);
        }
      } else if (this.getters.getUser != null) {
        commit('setUser', null);
        router.go(router.currentRoute);
      } else {
        commit('setUser', null);
      }
    },
    async updateMissingMetadata({ commit }) {
      if (this.getters.getUser.user_metadata.credit == null) {
        const { data } = await supabase.auth.updateUser({
          data: { credit: 0 },
        });
        commit('setUser', data.user);
      }
      if (this.getters.getUser.user_metadata.credit == null) {
        const { data } = await supabase.auth.updateUser({
          data: { isCompanyLeader: false },
        });
        commit('setUser', data.user);
      }
    },
    async signInAction({ commit }, { form, path }) {
      try {
        commit('setState', 'loading');

        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        console.log('Successfully signed in');
        commit('setUser', data.user);
        this.dispatch('checkUserCompany');

        commit('setState', 'success');

        if (path == null) await router.replace('/account');
        else if (path.split('_')[0] == 'ext') {
          window.location.replace(
            process.env.VUE_APP_BUSINESS_URL + path.split('_')[1] + '?ext=true'
          );
        } else await router.replace(path);
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async signUpAction({ commit }, { form, path }) {
      try {
        commit('setState', 'loading');

        const splitName = form.name.split(' ');
        const name1 =
          splitName[0].charAt(0).toUpperCase() +
          splitName[0].slice(1).toLowerCase();
        const name2 =
          splitName[1].charAt(0).toUpperCase() +
          splitName[1].slice(1).toLowerCase();

        const capitalizedName = name1 + ' ' + name2;

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: capitalizedName,
              credit: 0,
              isCompanyLeader: false,
            },
          },
        });
        if (error) throw error;
        console.log('Successfully registered');
        commit('setUser', data.user);

        commit('setState', 'success');

        this.dispatch('checkUserCompany');

        if (path == null) await router.replace('/account');
        else await router.replace(path);
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async signOutAction({ commit }) {
      try {
        commit('setState', 'loading');

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        commit('setUser', null);
        console.log('Logged Out successfully');

        commit('setState', 'success');

        await router.replace('/auth');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async resetPasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading');

        const { error } = await supabase.auth.resetPasswordForEmail(
          form.email,
          {
            redirectTo: process.env.VUE_APP_MAIN_URL + '/update-password',
          }
        );
        if (error) throw error;

        commit('setState', 'success');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },
    async updatePasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading');

        const { error } = await supabase.auth.updateUser({
          password: form.password,
        });
        if (error) throw error;

        commit('setState', 'success');

        await router.replace('/account');
      } catch (error) {
        commit('setState', 'failure');
        console.log(error.error_description || error.message);
      }
    },

    async checkUserCompany({ commit }) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select()
          .or(
            'user_uid.eq.' +
              this.getters.getUser.id +
              ',employees.cs.' +
              '{"' +
              this.getters.getUser.email +
              '"}'
          );

        if (error) throw error;

        let user = this.getters.getUser;
        user.hasCompany = false;
        commit('setUser', user);
        if (data[0] == null) return;

        user.hasCompany = true;
        commit('setUser', user);
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },
  },

  modules: {},

  plugins: [createPersistedState()],
});

export default store;
