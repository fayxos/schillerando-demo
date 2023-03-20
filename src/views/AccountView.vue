<template>
  <AlertBanner title="Coming Soon" />
  <TitleDiv title="Alle Infos über dein Kundenkonto oder dein Unternehmen" />
  <InfoDiv
    info="Hier kannst du in Zukunft dein Konto verwalten. Du siehst dein aktuelles Guthaben, deine Bestellungen und kannst Abonements abschließen. Falls du ein Unternehmen hast, kannst du hier dein Unternehmensprofil bearbeiten und Produkte und Preise einstellen." />
  <div v-if="this.auth.user == null">
    <input id="mail" type="text" placeholder="E-Mail">
    <input id="passwd" type="password" placeholder="Password">
    <button @click="signIn">Anmelden</button>
    <button @click="signUp">Registrieren</button>
  </div>
  <div v-else-if="company.length != 0">
    <label for="name">Name:</label>
    <input type="text" name="name" v-model="this.company[0].name"><br>
    <label for="info">Info:</label>
    <input type="text" name="info" v-model="company[0].info"><br>
    <button @click="saveChanges">Änderungen speichern</button>
  </div>
</template>

<script>
import AlertBanner from '../components/AlertBanner'
import TitleDiv from '../components/TitleDiv'
import InfoDiv from '../components/InfoDiv'
import { supabase } from '../main.js'

export default {
  name: 'AccountView',
  components: {
    AlertBanner,
    TitleDiv,
    InfoDiv
  },
  data() {
    return {
      auth: { user: null, session: null },
      company: []
    }
  },
  methods: {
    async signIn() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('mail').value,
        password: document.getElementById('passwd').value,
      })
      this.auth = data
      if (error != null) console.log("Error logging in", error)
      //Download corresponding company data
      this.company = (await supabase
        .from('companies')
        .select()
        .eq('user_uid', this.auth.user.id)).data
    },
    async signUp() {
      const { data, error } = await supabase.auth.signUp({
        email: document.getElementById('mail').value,
        password: document.getElementById('passwd').value,
      })
      this.auth = data
      if (error != null) console.log("Error signing up", error)
    },
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
