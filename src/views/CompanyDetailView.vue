<template>
  <TitleDiv title="Unternehmen" />
  <div v-if="company === null">
    Ups, dieses Unternehmen scheint nicht zu existieren
  </div>
</template>

<script>
import TitleDiv from '../components/TitleDiv';
import { supabase } from '../supabase';

export default {
  name: 'CompanyView',
  props: ["companyuuid"],
  data() {
    return {
      company: undefined
    }
  },
  components: {
    TitleDiv,
  },
  async mounted() {
    if (this.$route.params.companyalias) {
      const { data, error } = await supabase
        .from('companies')
        .select()
        .eq('alias', this.$route.params.companyalias)
      if (error != null) console.log(error);
      if (data.length === 0) { this.company = null; return; }
      this.company = data[0];
    }
  },
};
</script>