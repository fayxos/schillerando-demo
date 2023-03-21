<template>
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
