<template>
  <TitleDiv title="Unternehmen" />
  <div class="row">
    <div class="col col-xl-1 col-xxl-2 big"></div>

    <div v-if="!loading" class="col col-lg-6 col-xl-5 col-xxl-4">
      <div class="mapWrapper">
        <MapProvider
          @pickCompany="pickCompany($event)"
          class="map"
          :companies="companies"
        />
      </div>
    </div>

    <div
      v-if="companies.length > 0"
      class="col col-lg-6 col-xl-5 col-xxl-4 big"
    >
      <div class="company">
        <CompanyTile
          :no-margin="true"
          :data="
            pickedCompany == null
              ? companies[companies.findIndex((c) => c.alias == 'schillerando')]
              : pickedCompany
          "
        />
      </div>
    </div>

    <div v-if="pickedCompany != null" id="company" class="small">
      <div class="company">
        <CompanyTile :data="pickedCompany" :no-margin="true" />
      </div>
    </div>
  </div>

  <SortableList :items="companies" :loading="loading" element="CompanyTile" />
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
import CompanyTile from '../components/CompanyTile.vue';
import MapProvider from '@/components/MapProvider.vue';
import SortableList from '@/components/SortableList.vue';
import { getAll } from '@/database';

import TitleDiv from '@/shared/components/TitleDiv';

export default {
  name: 'CompanyView',
  components: {
    TitleDiv,
    SortableList,
    MapProvider,
    CompanyTile,
  },
  data() {
    return {
      companies: [],
      pickedCompany: null,
      loading: true,
    };
  },
  async created() {
    try {
      // TODO
      const companies = await getAll("companies")

      // const { data, error } = await supabase
      //   .from('companies')
      //   .select()
      //   .eq('verified', true)
      //   .neq('abo', null);
      // if (error) throw error;
      this.companies = companies;

      for (var i = 0; i < this.companies.length; i++) {
        this.companies[i].stars = 0;
      }

      console.log(this.companies)

      {
      //   const { data, error } = await supabase.from('product_reviews').select();

      const product_reviews = await getAll("product_reviews")

      //   if (error) throw error;

        var company_reviews = [];
        product_reviews.forEach((review) => {
          var index = company_reviews.findIndex(
            (company) => company.id == review.company
          );

          if (index == -1) {
            company_reviews.push({
              id: review.company,
              products: [{ id: review.product, stars: review.stars, count: 1 }],
            });
          } else {
            var p_index = company_reviews[index].products.findIndex(
              (product) => product.id == review.product
            );

            if (p_index == -1) {
              company_reviews[index].products.push({
                id: review.product,
                stars: review.stars,
                count: 1,
              });
            } else {
              company_reviews[index].products[p_index].stars += review.stars;
              company_reviews[index].products[p_index].count++;
            }
          }
        });

        company_reviews.forEach((company) => {
          var index = this.companies.findIndex((c) => c.id == company.id);

          if (index == -1) return;

          var stars = 0;
          company.products.forEach((product) => {
            stars += Math.round((product.stars / product.count) * 10) / 10;
          });

          this.companies[index].stars =
            Math.round((stars / company.products.length) * 10) / 10;
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.loading = false;
  },
  methods: {
    async pickCompany(company) {
      this.pickedCompany = company;

      await new Promise((resolve) => setTimeout(resolve, 100));

      var element = document.getElementById('company');

      if (element == null) return;

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    },
  },
};
</script>

<style scoped>
.spinner-border {
  color: #00a100;
}

.row {
  margin: 0;
  padding: 0;
  margin-bottom: 50px;
}

.col {
  margin: 0;
  padding: 0;
}

.sizing {
  max-width: 60vh;
}

.company {
  padding: 0 25px 0 12.5px;
}

.mapWrapper {
  position: relative;
  width: calc(100% - 37.5px);
  padding-bottom: calc(100% - 37.5px);
  margin: 0 12.5px 0 25px;
}

.mapDivider {
  margin-top: 15px;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  left: 0;
  border-style: groove;
  border-color: #ebebeb;
  border-width: 1px;
}

.small {
  margin-top: 35px;
  margin-bottom: 20px;
  display: none;
}

.center {
  margin: 0 auto 0 auto;
}

@media (min-width: 576px) and (max-width: 992px) {
  .big {
    display: none;
  }

  .small {
    display: block;
  }

  .mapWrapper {
    position: relative;
    width: calc(100% - 150px);
    padding-bottom: calc(100% - 150px);
    margin: 0 75px 0 75px;
  }

  .company {
    padding: 0 12px 0 12px;
  }
}

@media (max-width: 576px) {
  .big {
    display: none;
  }

  .small {
    display: block;
  }

  .mapWrapper {
    position: relative;
    width: calc(100% - 50px);
    padding-bottom: calc(100% - 50px);
    margin: 0 25px 0 25px;
  }

  .company {
    padding: 0 12px 0 12px;
  }
}
</style>
