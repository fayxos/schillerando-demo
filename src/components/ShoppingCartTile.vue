<template>
  <div v-if="this.data != null && this.data != undefined" class="card">
    <div class="main">
      <div class="image">
        <div v-if="this.image == null" class="no-image">
          <i class="fa-solid fa-image fa-2xl"></i>
        </div>
        <img v-else :src="this.image" alt="Produkt Bild" />
      </div>
      <div class="info">
        <div>
          <p class="name">{{ data.name }}</p>
        </div>
        <div>
          <p v-if="data.company != undefined" class="company_name">
            {{ data.company.name }}
          </p>
        </div>

        <p class="price">{{ data.price }} $</p>

        <div v-if="editable == true" class="input-group input-group-sm count">
          <button
            v-if="count == 1"
            @click="countDown(true)"
            class="input-group-text"
          >
            <i color="red" class="fa-solid fa-trash-can"></i>
          </button>
          <button v-else @click="countDown" class="input-group-text">-</button>
          <input
            disabled
            id="countInput"
            style="background-color: white"
            :value="count"
            type="number"
            class="form-control"
            aria-label="Anzahl an Produkten"
            min="1"
            max="9"
          />
          <button v-if="count == 9" class="input-group-text">
            &nbsp;&nbsp;&nbsp;
          </button>
          <button
            v-else
            :disabled="count >= 9"
            @click="countUp"
            class="input-group-text"
          >
            +
          </button>
        </div>

        <div v-else>
          <p class="checkout-count">{{ count }}x</p>
        </div>
      </div>
    </div>

    <div class="main row" v-if="data.has_variations">
      <div class="left col col-4">
        <p class="title">Variation</p>
      </div>

      <div class="right col">
        <p class="variation">
          {{
            this.data.variations.find(
              (variation) => variation.id == data.variation
            ).name
          }}
        </p>
      </div>
    </div>

    <div
      class="main row"
      v-if="data.picked_extras != undefined && data.picked_extras.length > 0"
    >
      <div class="left col col-4">
        <p class="title">Extras</p>
      </div>

      <div class="right col col-8">
        <p class="variation">
          <span v-for="extra in extras" :key="extra.id"
            >{{ extra.name
            }}<span v-if="extras.indexOf(extra) != extras.length - 1"
              >,
            </span></span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';


export default {
  name: 'ShoppingCartTile',
  props: ['data', 'editable'],
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  data() {
    return {
      image: null,
      count: null,
      extras: [],
    };
  },
  async mounted() {
    this.count = this.data.count;

    console.log(this.data);

    if (
      this.data.picked_extras != undefined &&
      this.data.picked_extras != null
    ) {
      this.data.picked_extras.forEach((extra) => {
        this.extras.push(this.data.extras.find((e) => e.id == extra));
      });

      this.extras.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (this.data.product_picture != null) {
      //TODO
      // const response = await supabase.storage
      //   .from('public/products-pictures')
      //   .download(this.data.product_picture);
      // if (response.data != null) this.image = await response.data.text();
      // if (response.error) console.warn(response.error);
    }
  },
  methods: {
    countUp() {
      this.count++;

      if (this.count > 9) this.count = 9;
      else this.store.commit('addProductToCart', this.data);
    },
    countDown(remove) {
      this.count--;

      console.log(this.count);

      if (this.count < 1 && !remove) this.count = 1;
      else this.store.commit('removeOneProductFromCart', this.data);
    },
  },
};
</script>

<style scoped>
.price,
.name {
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
  font-weight: 600;
}

.name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.btn {
  position: absolute;
  bottom: 8px;
  right: 10px;
  padding: 3px 11px 3px 9px;
}

.name {
  text-align: left;
  margin: 10px 0 0 15px;
}

.company_name {
  text-align: left;
  margin-left: 15px;
  font-weight: 300;
  margin-top: -3px;
}

.price {
  position: absolute;
  text-align: left;
  bottom: 8px;
  left: 15px;
  color: black;
  background-color: white;
  width: 100%;
}

.row {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.row,
.col {
  margin: 0;
  padding: 0;
}

.info {
  position: absolute;
  width: 58%;
  height: 100%;
  top: 0;
  left: 40%;
}

.card {
  overflow: hidden;
  margin: 2.5%;
}

.main {
  position: relative;
  text-align: left;
  height: fit-content;
}

.left {
  width: 40%;
  padding: 5px 15px;
  border-right: 1px solid;
  border-top: 1px solid;
  border-color: #cfd4da;
}

.right {
  width: 60%;
  border-top: 1px solid;
  border-color: #cfd4da;
  margin: 0;
  padding: 0;
}

.image {
  width: 40%;
  position: relative;
  padding-bottom: 40%;
  margin-right: 10px;
  border-right: 1px solid;
  border-color: #cfd4da;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.fa-image {
  position: absolute;
  font-size: 4rem;
  top: 50%;
  left: calc(50% - 2rem);
  color: black;
}

.count {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 78px;
}

.checkout-count {
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
  font-weight: 600;
  position: absolute;
  right: 15px;
  bottom: 8px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/*   border-radius: 0.375rem 0 0 0.375rem; */

.title {
  padding: 0;
  margin: 0;
}

.variation {
  margin: 5px 15px;
  padding: 0;
  text-align: left;
  word-wrap: break-word;
  height: fit-content;
}
</style>
