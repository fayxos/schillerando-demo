<template>
  <div class="outer">
    <div
      v-if="this.company === undefined"
      class="spinner-border"
      style="
        width: 4rem;
        height: 4rem;
        border-width: 7px;
        position: relative;
        margin-top: 50px;
      "
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else-if="this.company === null" class="mt-4">
      <h3 class="m-4" style="text-align: center">
        Ups, dieses Seite scheint nicht zu existieren
      </h3>
    </div>
    <div v-else class="row wrapper">
      <div class="col-lg-5 col-xl-4 spacer no-border"></div>
      <div class="wrapper col-lg-5 col-xl-4">
        <div class="image">
          <div v-if="this.image == null" class="no-image">
            <i class="fa-solid fa-image fa-2xl"></i>
          </div>
          <img
            v-else
            :src="this.image"
            alt="Unternehmen Bild"
            id="companyImage"
          />
        </div>

        <div class="detail-wrapper">
          <div class="details">
            <div class="row spacing">
              <h1 class="col-10 title">
                {{ this.company.name }}
              </h1>
              <div class="col-2">
                <CompanyBadge
                  :verified="this.company.verified"
                  :premium="this.company.abo == 'Business'"
                  :self="this.company.alias == 'schillerando'"
                  class="company-badge"
                />
              </div>
            </div>

            <div class="category spacing">
              {{ company.categories.replace("{", "").replace("}", "").replace('"', "").replace('"', "").trim() }}
            </div>

            <div class="row spacing">
              <p class="info">
                {{ this.company.info }}
              </p>
            </div>

            <div class="spacing location-pos">
              <div class="col-9 location">
                <i class="fa-solid fa-location-dot"></i>
                <div class="location-text">
                  {{ company.location }}&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <a
                  v-if="
                    company.socials.instagram !== undefined &&
                    company.socials.instagram != null
                  "
                  :href="this.company.socials.instagram"
                  class="insta"
                  ><i class="fa-brands fa-instagram fa-lg"></i
                ></a>
              </div>
              <div class="product-stars">
                <div>
                  <span class="average" v-if="total_stars == 0">-</span>
                  <span class="average" v-else>{{ total_stars }}</span>
                  <i class="fa-solid fa-star fa-xl solid-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div
              v-if="
                company.pinData != undefined &&
                company.coordinates.length > 10 &&
                !loading
              "
              class="mapWrapper"
            >
              <MapProvider :data="company.pinData" class="map" />
            </div>
          </div>
        </div>

        <hr class="mapDivider" />
      </div>

      <div v-if="!loading" class="products col-lg-7 col-xl-8">
        <SortableList
          v-if="products.length > 0"
          :items="products"
          :no-search="true"
          sort-by-categories="true"
          show-category="true"
          element="ProductTile"
        />

        <h4 v-else class="margin">
          Dieses Unternehmen bietet keine Produkte, Aktivitäten oder
          Dienstleistungen auf Schillerando an.
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
// import router from '@/router';

import CompanyBadge from '@/shared/components/CompanyBadge.vue';
import SortableList from '@/components/SortableList.vue';
import MapProvider from '@/components/MapProvider.vue';
import { executeQuery } from '@/database';

export default {
  name: 'CompanyDetailView',
  props: ['companyuuid'],
  components: { CompanyBadge, SortableList, MapProvider },
  data() {
    return {
      company: undefined,
      image: null,
      products: [],
      loading: true,
      total_stars: 0,
    };
  },
  async mounted() {
    if (this.$route.params.companyalias) {

      const companies = await executeQuery("SELECT * FROM companies WHERE alias='" + this.$route.params.companyalias + "'");

      if(companies.length > 0) {
        this.company = companies[0];
      } else {
        const companies = await executeQuery("SELECT * FROM companies WHERE redirect_aliases LIKE '%" + this.$route.params.companyalias + "%'");
     
        if(companies.length > 0) {
          this.company = companies[0];
        }   
      }

      // let { data, error } = await supabase
      //   .from('companies')
      //   .select()
      //   .eq('alias', this.$route.params.companyalias);
      // if (error !== null) console.log(error);
      // if (data !== null && data.length !== 0) {
      //   this.company = data[0];
      //   console.log('Opening company by alias', this.company.alias);
      // } else {
      //   let { data, error } = await supabase
      //     .from('companies')
      //     .select()
      //     .contains('redirect_aliases', [this.$route.params.companyalias]);
      //   if (error !== null) console.log(error);
      //   if (data !== null && data.length !== 0) {
      //     this.company = data[0];
      //     console.log(
      //       'Opening company by redirect alias ' +
      //         this.$route.params.companyalias +
      //         ' redirecting to ' +
      //         this.company.alias
      //     );
      //     router.replace('/' + this.company.alias);
      //   } else {
      //     console.log(
      //       'Company ' + this.$route.params.companyalias + ' not found'
      //     );
      //     this.company = null;
      //     return;
      //   }
      // }

      if(this.company.coordinates != undefined &&
        this.company.coordinates != null) {
          this.company.pinData = [
            { position: companies[0].coordinates, image: null }
          ];
      }
      

      //TODO
      // if (this.company.header_picture != null) {
        // const response = await supabase.storage
        //   .from('public/sellers-headings')
        //   .download(this.company.header_picture);
        // if (response.data != null) {
        //   this.image = await response.data.text();
        //   if (
        //     this.company.coordinates != undefined &&
        //     this.company.coordinates != null
        //   )
        //     this.company.pinData = [
        //       { position: this.company.coordinates, image: this.image },
        //     ];
        // }
        // if (response.error) console.warn(response.error);
      // } else {
      //   if (
      //     this.company.coordinates != undefined &&
      //     this.company.coordinates != null
      //   )
      //     this.company.pinData = [
      //       { position: data[0].coordinates, image: null },
      //     ];
      //   else this.company.pinData = null;
      // }

      // console.log(this.company.pinData);

      const products = await executeQuery("SELECT * FROM products WHERE company_id='" + this.company.id + "' and public=true");

      if (products.length > 0) {
          products.forEach((product) => {
            product.company = {
              "name": this.company.name,
              "abo": this.company.abo,
              "alias": this.company.alias
            }
            this.products.push(product);
          });
        }

      // {
      //   const response = await supabase
      //     .from('products')
      //     .select(`*, company:companies(name, abo, alias)`)
      //     .eq('company_id', this.company.id)
      //     .eq('public', true);

      //   if (response.data != null) {
      //     response.data.forEach((product) => {
      //       this.products.push(product);
      //     });
      //   }

      //   console.log('Products array of /' + this.company.alias, this.products);

      //   if (response.error) console.warn(response.error);
      // }

      const product_reviews = await executeQuery("SELECT * FROM product_reviews WHERE company='" + this.company.id + "'");

      product_reviews.forEach((review) => {
        var index = this.products.findIndex(
          (product) => product.id == review.product
        );
        if (index != -1) {
          if (this.products[index].reviews == undefined) {
            this.products[index].reviews = [];
          }
          this.products[index].reviews.push(review);
        }
      });
      var i = 0;
      var count = 0;
      this.products.forEach((product) => {
        if (product.reviews != undefined && product.reviews.length > 0) {
          var stars = 0;
          product.reviews.forEach((review) => {
            stars += review.stars;
          });
          this.products[i].stars =
            Math.round((stars / product.reviews.length) * 10) / 10;
          this.total_stars += this.products[i].stars;
          count++;
        } else {
          this.products[i].stars = 0;
        }
        i++;
      });
      if (count > 0)
        this.total_stars = Math.round((this.total_stars / count) * 10) / 10;
      }

      // {
      //   const { data, error } = await supabase
      //     .from('product_reviews')
      //     .select()
      //     .eq('company', this.company.id);
      //   if (error) console.warn(error);
      //   data.forEach((review) => {
      //     var index = this.products.findIndex(
      //       (product) => product.id == review.product
      //     );
      //     if (index != -1) {
      //       if (this.products[index].reviews == undefined) {
      //         this.products[index].reviews = [];
      //       }
      //       this.products[index].reviews.push(review);
      //     }
      //   });
      //   var i = 0;
      //   var count = 0;
      //   this.products.forEach((product) => {
      //     if (product.reviews != undefined && product.reviews.length > 0) {
      //       var stars = 0;
      //       product.reviews.forEach((review) => {
      //         stars += review.stars;
      //       });
      //       this.products[i].stars =
      //         Math.round((stars / product.reviews.length) * 10) / 10;
      //       this.total_stars += this.products[i].stars;
      //       count++;
      //     } else {
      //       this.products[i].stars = 0;
      //     }
      //     i++;
      //   });
      //   if (count > 0)
      //     this.total_stars = Math.round((this.total_stars / count) * 10) / 10;
      // }
    // }

    if (
      this.company.socials.includes("instagram") && this.company.socials.split('"instagram":')[1].replace('"', "").replace("}", "").replace('"', "").trim() != ""
    )
      this.company.socials = {
        "instagram": 'https://instagram.com/' + this.company.socials.split('"instagram":')[1].replace('"', "").replace("}", "").replace('"', "").trim()
      }

    this.loading = false;
  },
};
</script>

<style scoped>
div {
  text-align: left;
}

h1,
p {
  padding: 0;
}

.image {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  left: 0;
}

.fa-image {
  position: absolute;
  font-size: 6rem;
  top: 50%;
  left: calc(50% - 3rem);
}

.title {
  color: #00a100;
}

.info {
  margin-top: 10px;
  font-size: 1.1rem;
}

.details {
  margin-top: 15px;
}

.company-badge {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  float: right;
  right: 12px;
}

.spacing {
  position: relative;
  padding: 0;
  margin: 7px 7px 0 15px;
}

.category {
  margin-top: -10px;
  font-weight: 300;
}

.location {
  color: gray;
  padding: 0;
  display: flex;
  margin-bottom: 20px;
}

.location-text {
  margin-left: 5px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.2rem;
  max-height: 1.2rem;
  overflow: hidden;
}

.products {
  margin-top: 20px;
  text-align: center;
}

.wrapper {
  padding: 0;
  margin: 0;
}

.col-lg-7 {
  margin: 10px 0;
  padding: 0;
}

.outer {
  margin-bottom: 100px;
}

.margin {
  margin: 20px 10px;
  text-align: center;
}

.spinner-border {
  color: #00a100;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.mapWrapper {
  position: relative;
  width: calc(100% - 30px);
  padding-bottom: calc(100% - 30px);
  margin: 0 15px 0 15px;
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

.insta {
  position: relative;
  bottom: 3px;
}

@media (min-width: 992px) {
  .col-lg-5 {
    border-right: 1px solid;
    border-bottom: 1px solid;
    border-color: #ebebeb;
    border-radius: 0 0 0.375rem 0;
    position: absolute;
  }

  hr {
    width: 0;
  }

  .no-border {
    border-bottom: 0px solid;
    border-right: 0px solid;
  }

  .spacer {
    position: relative;
  }
}

.product-stars {
  position: absolute;
  right: 25px;
  bottom: -3px;
}
.average {
  font-size: 1.3rem;
  position: relative;
  top: 2px;
  margin-right: 5px;
}
.fa-star {
  margin-right: 5px;
}
.solid-star {
  color: #e3c100;
}
.stars {
  display: flex;
}
.location-pos {
  position: relative;
  width: 100%;
}
</style>
