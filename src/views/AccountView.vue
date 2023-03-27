<template>
  <TitleDiv title="Account"/>

  <div v-if="this.company.length != 0">
    <label for="name">Name:</label>
    <input type="text" name="name" v-model="this.company[0].name"><br>
    <label for="info">Info:</label>
    <input type="text" name="info" v-model="company[0].info"><br>
    <button @click="saveChanges">Änderungen speichern</button>
  </div>

  <button @click.prevent="signOut">Sign out</button>
  <p>{{ userData }}</p>
</template>



<script>
import TitleDiv from '../components/TitleDiv'
import { supabase } from '../supabase'
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: 'AccountView',
  components: {
    TitleDiv,
  },
  data() {
    return {
      auth: { user: null, session: null },
      company: []
    }
  },
  setup() {
    const store = useStore();
    const userData = computed(() => store.state.user);
     const signOut = () => {
      store.dispatch("signOutAction");
    };
    return {
      signOut,
      userData,
    };
  },
  methods: {
    async saveChanges() {
      const { error } = await supabase
        .from('companies')
        .update({ name: this.company[0].name, info: this.company[0].info })
        .eq('user_uid', this.auth.user.id)
        .select()
      if (error != null) console.log("Error signing up", error)
    }
  }
}
</script>

<style>


</style>
