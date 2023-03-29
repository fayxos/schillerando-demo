import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import router from '../router';
import { supabase } from '../supabase'


const store = createStore({
  state: {
    user: null,
    userCompany: null,
    userCompanyDescription: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUserCompany(state, payload) {
      state.userCompany = payload;
    },
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getUserCompany (state) {
      return state.userCompany
    }
  },
  actions: {
    async signInAction({ commit }, form) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        console.log("Successfully signed in");
        commit('setUser', data.user)
        this.dispatch('startUserCompanySubscription') 
        await router.replace('/account')
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },

    async signUpAction({ commit }, form) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        console.log("Successfully registered");
        commit('setUser', data.user)
        await router.replace('/account')
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },

    async signOutAction({ commit }) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        commit('setUser', null)
        console.log("Logged Out successfully");
        this.dispatch('stopUserCompanySubscription')
        await router.replace("/auth");
      } catch (error) {
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