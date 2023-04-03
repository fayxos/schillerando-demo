<template>
  <TitleDiv title="Produkte" />
  <SortableList :items="products" element="ProductTile" />
</template>

<script>
import SortableList from '@/components/SortableList.vue';
import { supabase } from '@/supabase';
import TitleDiv from '../components/TitleDiv'

export default {
  name: 'ProductView',
  components: {
    TitleDiv,
    SortableList
  },
  data() {
    return {
      products: []
    }
  },
  async created() {
    const { data, error } = await supabase
          .from('products')
          .select()
    if (error != null) console.log(error)
    this.products = data
  }
}
</script>
