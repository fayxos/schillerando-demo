import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import router from '../router';
import { supabase } from '../supabase'


const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  getters: {
    getUser (state) {
      return state.user
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
        await router.replace("/auth");
      } catch (error) {
        console.log(error.error_description || error.message);
      }
    },
  },
  modules: {
  },

  plugins: [createPersistedState()],

})

export default store;