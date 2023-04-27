<template>
  <TitleDiv title="Unternehmen" />
  <SortableList :items="companies" element="CompanyTile" />
</template>

<script>
import SortableList from '@/components/SortableList.vue';
import { supabase } from '@/supabase';
import TitleDiv from '../components/TitleDiv';

export default {
  name: 'CompanyView',
  components: {
    TitleDiv,
    SortableList,
  },
  data() {
    return {
      companies: [],
    };
  },
  async created() {
    const { data, error } = await supabase.from('companies').select();
    if (error != null) console.log(error);
    this.companies = data;
    console.log(this.companies);

    this.companies.forEach((company) => {
      switch (company.categories[0]) {
        case '1':
          company.category = 'Gastronomie';
          break;
        case '2':
          company.category = 'Kultur';
          break;
        case '3':
          company.category = 'Dienstleistung';
          break;
        case '4':
          company.category = 'Gastronomie & Deinstleistung';
          break;
        default:
          company.category = 'Keine kategorie';
          break;
      }
    });
  },
};
</script>
