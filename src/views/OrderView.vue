<template>
  <div class="container">
    <h1>Bestellung</h1>

    <div v-if="products != null" class="list">
      <div v-for="product in products" v-bind:key="product.id">
        <ShoppingCartTile :data="product" :editable="false" />
      </div>
    </div>

    <p class="total">Gesamtbetrag: <span class="price">{{ totalPrice }} $</span></p>

    <form>
      <div class="input-group mb-3">
        <span class="input-group-text"
          ><i class="fa-solid fa-location-dot"></i
        ></span>
        <textarea
          type="text"
          id="signup-info"
          class="form-control"
          @input="validateOrder(false)"
          placeholder="Genaue Beschreibung des Lieferortes"
          required
          maxlength="200"
          style="resize: none"
          rows="3"
          cols="50"
          :value="order.deliver_to"
        ></textarea>
      </div>

      <div class="input-group mb-4">
        <span class="input-group-text"
          ><i class="fa-solid fa-circle-info"></i></span>
        <textarea
          type="text"
          id="signup-info"
          class="form-control"
          @input="validateOrder(false)"
          placeholder="Anmerkungen zur Lieferung (Sonderwünsche etc.)"
          required
          maxlength="300"
          style="resize: none"
          rows="6"
          cols="50"
          :value="order.note"
        ></textarea>
      </div>

      <div class="form-check mt-4 mb-4">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="acceptCheck"
          @change="validateOrder(false)"
        />
        <label class="form-check-label" for="acceptCheck">
          <a href="/agb" class="text-primary">Allgemeine Geschäftsbedingungen</a> akzeptieren
        </label>
      </div>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from 'vue';
import ShoppingCartTile from '../components/ShoppingCartTile.vue';

export default {
  name: 'OrderView',
  components: {
    ShoppingCartTile
  },
  setup() {
    const store = useStore();

    const stackedProducts = []
    const cartProducts = store.state.shoppingCart

    cartProducts.forEach(product => {
      const index = stackedProducts.findIndex(p => p.id == product.id)
      if(index == -1) {
        product.count = 1
        stackedProducts.push(product)
      } else {
        stackedProducts[index].count += 1
      }
    });

    const products = stackedProducts

    console.log(products)

    const productCount = store.state.shoppingCart.length

    var price = 0

    store.state.shoppingCart.forEach(product => {
      price += product.price
    })

    const totalPrice = price

    const order = reactive({
      buyer: null,
      deliver_to: '',
      products: [],
      orderPrice: 0,
      payed: false,
      delivered: false,
      note: '',
    });

    return {
      store,
      products,
      productCount,
      totalPrice,
      order
    };
  },
  mounted() {
    this.order.buyer = this.store.state.user.id
    this.order.products = this.store.state.shoppingCart
    this.order.totalPrice = this.totalPrice
  },
  methods: {
    validateOrder(pressed) {
      console.log(pressed)
    }
  }
};
</script>

<style scoped>

h1 {
  margin: 30px 0 30px 20px;
}

.container {
  text-align: left;
}

.list {
  margin: 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
}

.total {
  font-weight: 700;
  font-size: 1.4rem;
  margin: 10px 0 40px 20px;
}

.price {
  font-weight: 500;
}

.input-group-text {
  width: 40px;
}

.fa-location-dot {
  position: relative;
  left: 2px;
}
</style>
