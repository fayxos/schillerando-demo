<template>
    <TitleDiv title="Produkt" />
    <div v-if="product === null">
      Ups, dieses Produkt scheint nicht zu existieren
    </div>
  </template>
  
  <script>
  import TitleDiv from '../components/TitleDiv';
  import { supabase } from '../supabase';
  
  export default {
    name: 'ProductDetailView',
    props: ["companyuuid"],
    data() {
      return {
        product: undefined
      }
    },
    components: {
      TitleDiv,
    },
    async mounted() {
      if (this.$route.params.productid) {
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('id', this.$route.params.productid)
        if (error != null) console.log(error);
        if (data === null || data.length === 0) { this.product = null; return; }
        this.product = data[0];
      }
    },
  };
  </script>