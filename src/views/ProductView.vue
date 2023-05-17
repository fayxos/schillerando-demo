<template>
  <TitleDiv title="Produkte" />
  <SortableList :items="products" :loading="loading" element="ProductTile" />

  <div
    v-if="loading"
    class="spinner-border"
    style="width: 4rem; height: 4rem; border-width: 7px"
    role="status"
  >
    <span class="visually-hidden">Loading...</span>
  </div>

  <p v-else>
    $ <span style="font-size: 1.3rem">&#8793;</span> {{ currency_name }} (1$ = 0.1€)
  </p>
</template>

<script>
import SortableList from '@/components/SortableList.vue';
import { supabase } from '@/supabase';
import TitleDiv from '../components/TitleDiv';

export default {
  name: 'ProductView',
  components: {
    TitleDiv,
    SortableList,
  },
  data() {
    return {
      products: [],
      loading: true,
      currency_name: process.env.VUE_APP_CURRENCY_NAME
    };
  },
  async created() {
    const { data, error } = await supabase
      .from('products')
      .select(`*, company:companies(name, abo, alias)`)
      .eq('public', true);

    if (error != null) console.log(error);

    var filtered = [];
    data.forEach((product) => {
      if (product.company.abo != null) filtered.push(product);
    });

    this.products = filtered;

    this.loading = false;
  },
};
</script>

<style>
.spinner-border {
  color: #00a100;
}
</style>
