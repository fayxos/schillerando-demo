<template>
  <TitleDiv title="Angebote" />

  <p style="margin-bottom: 50px; margin-top: -20px">
    $ <span style="font-size: 1.3rem">&#8793;</span> {{ currency_name }} (1$ =
    0.1€)
  </p>

  <SortableList :items="products" :loading="loading" element="ProductTile" />

  <div
    v-if="loading"
    class="spinner-border"
    style="width: 4rem; height: 4rem; border-width: 7px"
    role="status"
  >
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script>
import SortableList from '@/components/SortableList.vue';
import { executeQuery, getAll } from '@/database';

import TitleDiv from '@/shared/components/TitleDiv';

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
      currency_name: process.env.VUE_APP_CURRENCY_NAME,
    };
  },
  async created() {
    try {
      // const { data, error } = await supabase
      //   .from('products')
      //   .select(`*, company:companies(name, abo, alias, verified)`)
      //   .eq('public', true);

      const companies = await executeQuery("SELECT * FROM companies")

      const products = await executeQuery("SELECT * FROM products WHERE public=true")

      // if (error) throw error;

      var filtered = [];
      products.forEach((product) => {
        product.company = companies.filter(c => c.id == product.company_id)[0]
        product.reviews = [];
        filtered.push(product);
      });

      this.products = filtered;

      {
      //   const { data, error } = await supabase
      //     .from('product_reviews')
      //     .select(`*`);
      //   if (error) throw error;

      const reviews = await getAll("product_reviews");
      reviews.forEach((review) => {
          var index = this.products.findIndex(
            (product) => product.id == review.product
          );
          if (index != -1) {
            this.products[index].reviews.push(review);
          }
        });

        var i = 0;
        this.products.forEach((product) => {
          if (product.reviews.length > 0) {
            var stars = 0;
            product.reviews.forEach((review) => {
              stars += review.stars;
            });
            this.products[i].stars =
              Math.round((stars / product.reviews.length) * 10) / 10;
          } else {
            this.products[i].stars = 0;
          }
          i++;
        });
      }
      this.loading = false;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style scoped>
.spinner-border {
  color: #00a100;
}
</style>
