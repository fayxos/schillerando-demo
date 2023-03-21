<template>
  <TitleDiv title="Account"/>
  <LoginSignup />
  <div v-if="company.length != 0">
    <label for="name">Name:</label>
    <input type="text" name="name" v-model="this.company[0].name"><br>
    <label for="info">Info:</label>
    <input type="text" name="info" v-model="company[0].info"><br>
    <button @click="saveChanges">Änderungen speichern</button>
  </div>
</template>


<script>
import TitleDiv from '../components/TitleDiv'
import LoginSignup from '../components/LoginSignup'
import { supabase } from '../main.js'

export default {
  name: 'AccountView',
  components: {
    TitleDiv,
    LoginSignup
  },
  data() {
    return {
      auth: { user: null, session: null },
      company: []
    }
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
