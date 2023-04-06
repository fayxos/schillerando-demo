import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import router from '../router';
import { supabase } from '../supabase'


const store = createStore({
  state: {
    user: null,
    session: null,
    userCompany: null,
    userCompanyDescription: null,
    state: undefined
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUserCompany(state, payload) {
      state.userCompany = payload;
    },
    setState(state, payload) {
      state.state = payload;
    },
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getUserCompany (state) {
      return state.userCompany
    },
    getState (state) {
      return state.state
    }
  },
  actions: {
    async signInAction({ commit }, form) {
      try {
        commit('setState', 'loading')

        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        console.log("Successfully signed in");
        commit('setUser', data.user)
        this.dispatch('startUserCompanySubscription') 

        commit('setState', 'success')

        await router.replace('/account')
      } catch (error) {
        commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
    },

    async signUpAction({ commit }, form) {
      try {
        commit('setState', 'loading')

        const splitName = form.name.split(' ')
        const name1 = splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1).toLowerCase()
        const name2 = splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1).toLowerCase()
        
        const capitalizedName = name1 + ' ' + name2

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: capitalizedName,
              credit: 0
            },
          },
        });
        if (error) throw error;
        console.log("Successfully registered");
        commit('setUser', data.user)

        commit('setState', 'success')

        await router.replace('/account')
      } catch (error) {
        commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
    },

    async signOutAction({ commit }) {
      try {
        commit('setState', 'loading')

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        commit('setUser', null)
        console.log("Logged Out successfully");
        this.dispatch('stopUserCompanySubscription')

        commit('setState', 'success')

        await router.replace("/auth");
      } catch (error) {
        commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
    },

    async resetPasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading')

        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: 'http://localhost:8080/update-password', // https://schillerando.de/reset-password
        })
        if (error) throw error;

        commit('setState', 'success')
      } catch (error) {
        commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
    },
    async updatePasswordAction({ commit }, form) {
      try {
        commit('setState', 'loading')

        const { error } = await supabase.auth.updateUser({
          password: form.password
        })
        if (error) throw error;

        commit('setState', 'success')

        await router.replace("/account");
      } catch (error) {
        commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
    },

    async startUserCompanySubscription({ commit }) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select()
          .eq('user_uid', this.getters.getUser.id)

        if(error != null) {
          console.log(error.error_description || error.message);
          return;
        }

        if(data[0] == null) return

        commit('setUserCompany', data[0])

        const companySubscription = supabase
          .channel('any')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'companies', filter: 'id=eq.'+this.getters.getUserCompany.id }, payload => {
            console.log('Database change received!', payload)
            commit('setUserCompany', payload.new)
          })

          companySubscription.subscribe()
          this.userCompanyDescription = companySubscription
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },

    async stopUserCompanySubscription() {
      try {
        if(this.userCompanyDescription == null) return
        supabase.removeChannel(this.userCompanyDescription)
        this.userCompanyDescription = null
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    }
  },
  
  modules: {
  },

  plugins: [createPersistedState()],

})

export default store;
