<template>
  <div class="outer">
    <div
      v-if="this.product === undefined"
      class="spinner-border"
      style="width: 4rem; height: 4rem; border-width: 7px; margin-top: 50px"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else-if="this.product === null" class="mt-4">
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
          <img v-else :src="this.image" alt="Produkt Bild" id="companyImage" />
        </div>

        <div class="detail-wrapper">
          <div class="details">
            <div class="row spacing">
              <h1 class="col-8 title">
                {{ this.product.name }}
              </h1>
              <div class="col-4">
                <p v-if="this.price == null" class="price">
                  <span v-if="this.product.has_variations">ab</span>
                  {{ product.price + extra_price }} $
                </p>
                <p class="price" v-else>{{ price + extra_price }} $</p>
              </div>
            </div>

            <div v-if="product.categories != null" class="category spacing">
              {{ product.categories.replace("{", "").replace("}", "").replace('"', "").replace('"', "").trim() }}
            </div>

            <div class="spacing link">
              <router-link :to="`/${this.product.company.alias}`">
                {{ product.company.name }}
              </router-link>
            </div>

            <div class="row spacing">
              <p class="info">
                {{ this.product.info }}
              </p>
            </div>
          </div>

          <div class="select">
            <div v-if="this.product.has_variations" class="input-group mb-3">
              <span class="input-group-text"
                ><i class="fa-solid fa-bars"></i
              ></span>
              <select
                class="form-select"
                id="product-variation"
                aria-label="Default select example"
                :value="variation"
                @change="changeVariation()"
              >
                <option value="" selected>Variation</option>
                <option
                  v-for="variation in this.product.variations"
                  :key="variation.id"
                  :value="variation.id"
                >
                  {{ variation.name }} | {{ variation.price }} $
                </option>
              </select>
            </div>

            <div v-if="product.has_extras" class="extras">
              <p class="extras-header">Extras</p>
              <div
                class="check"
                v-for="extra in product.extras"
                :key="extra.id"
              >
                <div class="form-check">
                  <input
                    @change="switchExtra(extra)"
                    class="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ extra.name }} | +{{ extra.extra_price }} $
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="spacing">
            <button
              v-if="product.delivery"
              class="btn btn-primary deliver-btn"
              @click="addProductToCart"
              type="button"
              :disabled="
                this.product.has_variations &&
                (variation == null || variation == '')
              "
            >
              <div class="cart">Warenkorb</div>
              <i class="fa-solid fa-cart-plus fa-lg"></i>
            </button>

            <div v-else class="space"></div>

            <div class="product-stars">
              <div>
                <span class="average" v-if="this.reviews.length == 0">-</span>
                <span class="average" v-else>{{ product_stars }}</span>
                <i class="fa-solid fa-star fa-xl solid-star"></i>
              </div>
            </div>
          </div>

          <div v-if="this.product.delivery == false" class="no-delivery">
            <i class="fa-solid fa-circle-info"></i>
            <p class="no-delivery-info">
              Dieses Angebot ist nur direkt beim Unternehmen erhältlich und wird
              nicht zum Liefern angeboten.
            </p>
          </div>
        </div>

        <hr />
      </div>

      <div class="col-lg-7 col-xl-8">
        <div class="make-review">
          <div v-if="store.getters.getUser == null">
            <p class="alert">
              Du musst mit deinem Account angemeldet sein um eine Bewertung zu
              schreiben.
            </p>
          </div>
          <div
            v-else-if="
              store.getters.getUser.company_id != null &&
              this.product.company_id == store.getters.getUser.company_id
            "
          >
            <p class="alert">
              Du kannst Angebote deines eigenen Unternehmens nicht bewerten.
            </p>
          </div>
          <div v-else>
            <h5 class="review-heading">Bewerten & Rezension schreiben</h5>

            <div class="stars">
              <div v-for="star in [0, 1, 2, 3, 4]" :key="star">
                <i
                  v-if="star < this.stars"
                  @click="startReview(star)"
                  class="fa-solid fa-star fa-xl solid-star"
                ></i>
                <i
                  v-else
                  @click="startReview(star)"
                  class="fa-regular fa-star fa-xl"
                ></i>
              </div>
            </div>

            <div v-if="stars != 0">
              <textarea
                type="text"
                id="review-info"
                class="form-control"
                placeholder="Rezension schreiben"
                required
                maxlength="500"
                style="resize: none"
                rows="5"
                cols="50"
                :value="review_text"
              ></textarea>

              <div class="form-check form-switch mt-2">
                <input
                  :checked="anonym"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="review-anonym"
                />
                <label class="form-check-label" for="flexSwitchCheckChecked"
                  >Anonym</label
                >
              </div>

              <div style="display: flex">
                <div class="edit-buttons">
                  <button
                    type="button"
                    class="btn btn-warning px-2 mx-2"
                    @click="cancelReview()"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="edit-buttons">
                  <button
                    type="button"
                    class="btn btn-primary px-2 mx-2"
                    @click="postReview()"
                  >
                    <div>Posten</div>
                    <div class="spinner">
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 v-if="this.reviews.length == 0" class="no-reviews">
            Noch keine Bewertungen vorhanden
          </h4>
          <div class="reviews" v-else>
            <div v-for="review in reviews" :key="review.id" class="review">
              <ReviewTile :data="review" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewTile from '@/components/ReviewTile.vue';
import { executeQuery, getAll } from '@/database';

import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'ProductDetailView',
  props: ['companyuuid'],
  data() {
    return {
      product: undefined,
      image: null,
      price: null,
      extra_price: 0,
      variation: null,
      extras: [],
      stars: [],
      review_text: '',
      anonym: false,
      reviews: [],
      product_stars: 0,
    };
  },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  async mounted() {
    if (this.$route.params.productid) {
      try {
        //TODO
        // const { data, error } = await supabase
        //   .from('products')
        //   .select(`*, company:companies(name, alias)`)
        //   .eq('id', this.$route.params.productid);
        // if (error) throw error;

        // if (data === null || data.length === 0) {
        //   this.product = null;
        //   return;
        // }

        const companies = await executeQuery("SELECT * FROM companies")

        const products = await executeQuery("SELECT * FROM products WHERE id='" + this.$route.params.productid + "'")

        // if (error) throw error;

        products[0].company = companies.filter(c => c.id == products[0].company_id)[0]

        this.product = products[0];

        // this.product = data[0];

        if (this.product.has_variations) {

          const variations = await executeQuery("SELECT * FROM product_variations WHERE product='" + this.product.id + "' ORDER BY price");
        //   const { data, error } = await supabase
        //     .from('product_variations')
        //     .select()
        //     .eq('product', this.product.id)
        //     .order('price');

        //   if (error) throw error;

          if (variations.length > 0) this.product.variations = variations;
        }

        if (this.product.has_extras) {
          const extras = await executeQuery("SELECT * FROM product_extras WHERE product='" + this.product.id + "' ORDER BY extra_price");

        //   const { data, error } = await supabase
        //     .from('product_extras')
        //     .select()
        //     .eq('product', this.product.id)
        //     .order('extra_price');

        //   if (error) throw error;

          if (extras.length > 0) this.product.extras = extras;

        //   console.log(data);
        }

        // if (this.product.product_picture != null) {
        //   const response = await supabase.storage
        //     .from('public/products-pictures')
        //     .download(this.product.product_picture);
        //   if (response.data != null) this.image = await response.data.text();
        //   if (response.error) throw response.error;
        // }

        {
          const reviews = await executeQuery("SELECT * FROM product_reviews WHERE product='" + this.product.id + "'")

        //   const { data, error } = await supabase
        //     .from('product_reviews')
        //     .select('*, users(*)')
        //     .eq('product', this.product.id);

        //   if (error) throw error;

          const users = await getAll("users");
          
          this.reviews = []
          reviews.forEach((review) => {
            const filteredUsers = users.filter(u => u.id == review.reviewee);
            if(filteredUsers.length > 0) review.users = filteredUsers[0];
            this.reviews.push(review);
          });

          this.reviews.sort((a, b) => b.created_at.localeCompare(a.created_at));

          if (this.reviews.length > 0) {
            var totalStars = 0;
            this.reviews.forEach((review) => {
              totalStars += review.stars;
            });

            this.product_stars =
              Math.round((totalStars / this.reviews.length) * 10) / 10;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
    addProductToCart() {
      if (this.store.getters.getUser == null)
        this.$router.push({
          name: 'AuthView',
          query: { redirect: this.$route.path },
        });

      this.product.count = 1;
      var product = JSON.parse(JSON.stringify(this.product));

      if (product.has_variations) {
        product.price = this.price + this.extra_price;
      } else {
        product.price += this.extra_price;
      }
      product.variation = this.variation;

      if (product.has_extras) {
        product.picked_extras = JSON.parse(
          JSON.stringify(this.extras.sort((a, b) => a.localeCompare(b)))
        );
      }

      console.log(product);

      this.store.commit('addProductToCart', product);
    },
    changeVariation() {
      var variationInput = document.getElementById('product-variation');

      this.variation = variationInput.value;

      if (variationInput.value == '') {
        this.price = null;
      } else {
        this.price = this.product.variations.find(
          (variation) => variation.id == this.variation
        ).price;
      }
    },
    switchExtra(extra) {
      if (this.extras.includes(extra.id)) {
        this.extras = this.extras.filter((e) => e != extra.id);

        this.extra_price -= extra.extra_price;
      } else {
        this.extras.push(extra.id);

        this.extra_price += extra.extra_price;
      }
    },
    startReview(star) {
      if (this.stars == 0) {
        this.stars = star + 1;
        return;
      }

      var reviewInput = document.getElementById('review-info');
      this.review_text = reviewInput.value;
      this.stars = star + 1;
    },
    cancelReview() {
      this.stars = 0;
      this.review_text = '';
      this.anonym = false;
    },
    async postReview() {
      const textInput = document.getElementById('review-info');
      const anonymInput = document.getElementById('review-anonym');
      this.review_text = textInput.value;
      this.anonym = anonymInput.checked;
      try {
        await executeQuery(`INSERT INTO product_reviews (id, product, reviewee, text, stars, verified, anonym, company) VALUES (
          "`+ uuidv4() +`",  
          "`+ this.product.id +`",
          "`+ this.store.getters.getUser.id +`",
          "`+ this.review_text +`",
          "`+ this.stars +`",
          `+ true +`,
          "`+ this.anonym +`",
          "`+ this.product.id +`"
        )`)

        {
          const reviews = await executeQuery("SELECT * FROM product_reviews WHERE product='" + this.product.id + "'")

        //   const { data, error } = await supabase
        //     .from('product_reviews')
        //     .select('*, users(*)')
        //     .eq('product', this.product.id);

        //   if (error) throw error;

          const users = await getAll("users");
          
          this.reviews = []
          reviews.forEach((review) => {
            const filteredUsers = users.filter(u => u.id == review.reviewee);
            if(filteredUsers.length > 0) review.users = filteredUsers[0];
            this.reviews.push(review);
          });

          this.reviews.sort((a, b) => b.created_at.localeCompare(a.created_at));

          if (this.reviews.length > 0) {
            var totalStars = 0;
            this.reviews.forEach((review) => {
              totalStars += review.stars;
            });

            this.product_stars =
              Math.round((totalStars / this.reviews.length) * 10) / 10;
          }
        }

        this.stars = 0;
        this.review_text = '';
        this.anonym = false;

        // const { data, error } = await supabase
        //   .from('product_reviews')
        //   .insert({
        //     product: this.product.id,
        //     company: this.product.company_id,
        //     reviewee: this.store.getters.getUser.id,
        //     text: this.review_text,
        //     stars: this.stars,
        //     verified: null,
        //     anonym: this.anonym,
        //   })
        //   .select('*, users(*)');
        // if (error) throw error;
        // this.reviews.push(data[0]);
        // var totalStars = 0;
        // this.reviews.forEach((review) => {
        //   totalStars += review.stars;
        // });

        // this.product_stars =
        //   Math.round((totalStars / this.reviews.length) * 10) / 10;
        // this.reviews.sort((a, b) => b.created_at.localeCompare(a.created_at));
        // this.stars = 0;
        // this.review_text = '';
        // this.anonym = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
  components: { ReviewTile },
};
</script>

<style scoped>
div {
  text-align: left;
}

h1,
p {
  padding: 0;
  margin: 0;
}

.image {
  width: 100%;
  position: relative;
  padding-bottom: 100%;
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
  font-size: 1.9rem;
  color: #00a100;
  overflow: hidden;
  word-wrap: break-word;
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
  margin-top: 0px;
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

.price {
  color: black;
  font-size: 1.6rem;
  text-align: right;
}

.outer {
  margin-bottom: 100px;
}

.no-reviews {
  text-align: center;
  margin: 30px 10px;
}

.cart {
  display: inline;
  margin-right: 10px;
  font-size: 1.2rem;
  position: relative;
  top: 1px;
}

.link {
  font-size: 1.25rem;
}

.deliver-btn {
  background-color: #00a100;
  border-color: #00a100;
  margin-bottom: 20px;
  margin-top: 15px;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
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

.spinner-border {
  color: #00a100;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.select {
  margin: 20px 15px;
}

.extras {
  text-align: left;
  margin-bottom: 20px;
}

.check {
  margin-bottom: 5px;
}

.extras-header {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.form-check {
  margin-bottom: 2px;
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

.make-review {
  padding: 15px;
  margin: 10px 15px 10px 15px;
  border-radius: 10px;
  background-color: #e8ebe8;
}

#review-info {
  margin-top: 20px;
  color: black;
  background-color: white;
}

.spinner {
  display: none;
}

.edit-buttons {
  margin-top: 15px;
  margin-left: -7px;
}

.reviews {
  margin: 10px 15px 10px 15px;
}
.review {
  margin-bottom: 10px;
}

.product-stars {
  position: absolute;
  right: 5px;
  bottom: 25px;
}

.average {
  font-size: 1.3rem;
  position: relative;
  top: 2px;
  margin-right: 5px;
}

.alert {
  font-size: 1.1rem;
}

.space {
  height: 50px;
}

.no-delivery {
  padding: 15px;
}

.fa-circle-info {
  margin-right: 5px;
}

.no-delivery-info {
  display: inline;
}
</style>
