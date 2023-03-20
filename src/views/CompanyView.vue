<template>
  <AlertBanner title="Coming Soon" />
  <TitleDiv title="Alle Unternehmen im Staat auf einen Blick" />
  <InfoDiv
    info="Hier hast du in Zukunft einen Überblick über alle Unternehmen und Angebote im Staat. Du kannst sehen wo sich die Unternehmen befinden und welche Produkte sie anbieten. Außerdem kannst du Unternehmen bewerten und die Bewertungen von anderen lesen." />
  <CompanyTile v-for="company in companies" :key="company.id" :companyObject="company" />
</template>

<script setup>
import { supabase } from '../main.js'
import { ref, onMounted } from 'vue'

const companies = ref([])

async function getCompanies() {
  const { data } = await supabase.from('companies').select("*")
  companies.value = data
}

onMounted(() => {
    getCompanies()
  })
</script>

<script>
import AlertBanner from '../components/AlertBanner'
import TitleDiv from '../components/TitleDiv'
import InfoDiv from '../components/InfoDiv'
import CompanyTile from '../components/CompanyTile.vue'

export default {
  name: 'CompanyView',
  components: {
    AlertBanner,
    TitleDiv,
    InfoDiv,
    CompanyTile
  },
  data() {
    return {}
  },
}
</script>
