<template>
  <div class="container" v-if="!loading">
    <h1>Bestellung</h1>

    <div class="details">
      <div class="order_info">
        <i class="fa-solid fa-calendar"></i>
        <span>{{ this.day }}</span>

        <div class="order_time">
          <i class="fa-solid fa-clock"></i>
          <span>{{ this.order_time }}</span>
        </div>
      </div>

      <div class="delivery_info">
        <div>
          <span v-if="this.order.driver == null" class="badge text-bg-warning"
            >In Bearbeitung</span
          >
          <span
            v-else-if="this.delivery_time == null"
            class="badge text-bg-success"
            >In Zulieferung</span
          >
          <span v-else class="badge text-bg-secondary">Geliefert</span>
        </div>

        <div class="delivery_time">
          <div v-if="this.delivery_time != null && this.delivery_time != ''">
            <i class="fa-solid fa-truck"></i>
            {{ this.delivery_time }}
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="this.order.delivery_time == null"
      @click="$router.push(qrLink)"
      class="btn btn-primary btn-sm"
    >
      <i class="fa-solid fa-qrcode fa-xl"></i>
      <span class="qr">QR Code</span>
    </button>

    <div v-if="order.order_products.length > 0" class="list">
      <div
        v-for="product in order.final_products"
        v-bind:key="product.id + product.variation + product.picked_extras"
      >
        <ShoppingCartTile :data="product" :editable="false" />
      </div>
    </div>

    <p class="total">
      Gesamtbetrag: <span class="price">{{ order.order_price }} $</span>
    </p>

    <form class="mx-3">
      <div class="input-group mb-3">
        <span class="input-group-text"
          ><i class="fa-solid fa-location-dot"></i
        ></span>
        <textarea
          type="text"
          id="order-location"
          class="form-control"
          placeholder="Genaue Beschreibung des Lieferortes"
          required
          maxlength="200"
          style="resize: none"
          rows="3"
          cols="50"
          disabled
          :value="order.deliver_to"
        ></textarea>
      </div>

      <div class="input-group mb-4">
        <span class="input-group-text"
          ><i class="fa-solid fa-circle-info"></i
        ></span>
        <textarea
          type="text"
          id="order-note"
          class="form-control"
          placeholder="Anmerkungen zur Lieferung (Sonderwünsche etc.)"
          required
          disabled
          maxlength="300"
          style="resize: none"
          rows="6"
          cols="50"
          :value="order.note"
        ></textarea>
      </div>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import ShoppingCartTile from '../components/ShoppingCartTile.vue';
import { cutSecondsFromTime, reformatDate } from '@/helpers';
import { supabase } from '@/supabase';

export default {
  name: 'OrderDetailView',
  components: {
    ShoppingCartTile,
  },
  data() {
    return {
      day: '',
      order_time: '',
      delivery_time: '',
      order: null,
      loading: true,
    };
  },
  setup() {
    const store = useStore();

    const userData = computed(() => store.state.user);

    return {
      store,
      userData,
    };
  },
  computed: {
    qrLink() {
      if (this.order == null) return '';
      return `${this.order.id}/qr`;
    },
  },
  async mounted() {
    this.order = this.store.state.orders.find(
      (order) => order.id == this.$route.params.orderid
    );

    try {
      var productIds = [];
      var variationIds = [];
      var extraIds = [];
      this.order.order_products.forEach((product) => {
        productIds.push(`${product.product}`);

        if (product.variation != null)
          variationIds.push(`${product.variation}`);

        if (product.extras != null)
          product.extras.forEach((extra) => {
            extraIds.push(`${extra}`);
          });
      });

      const { data, error } = await supabase
        .from('products')
        .select()
        .filter('id', 'in', '(' + productIds + ')');

      if (error) throw error;

      data.forEach((product) => {
        var p = this.order.order_products.find(
          (pr) => pr.product == product.id
        );

        product.variation = p.variation;
        if (p.extras != null) product.picked_extras = p.extras;
        product.price = p.price;
        product.count = p.count;

        if (this.order.final_products == undefined)
          this.order.final_products = [];
        this.order.final_products.push(product);
      });

      if (variationIds.length > 0) {
        const { data, error } = await supabase
          .from('product_variations')
          .select()
          .filter('id', 'in', '(' + variationIds + ')');

        if (error) throw error;

        data.forEach((variation) => {
          for (var i = 0; i < this.order.final_products.length; i++) {
            if (this.order.final_products[i].variation == variation.id)
              this.order.final_products[i].variations = [variation];
          }
        });
      }

      if (extraIds.length > 0) {
        const { data, error } = await supabase
          .from('product_extras')
          .select()
          .filter('id', 'in', '(' + extraIds + ')');

        if (error) throw error;

        data.forEach((extra) => {
          for (var i = 0; i < this.order.final_products.length; i++) {
            if (
              this.order.final_products[i].picked_extras != undefined &&
              this.order.final_products[i].picked_extras.includes(extra.id)
            ) {
              if (this.order.final_products[i].extras == undefined)
                this.order.final_products[i].extras = [];
              this.order.final_products[i].extras.push(extra);
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    //this.order.order_products.forEach((product) => {});

    this.day = reformatDate(this.order.day);
    this.order_time = cutSecondsFromTime(this.order.order_time);
    this.delivery_time = cutSecondsFromTime(this.order.delivery_time);

    this.loading = false;

    console.log(this.order);
  },
};
</script>

<style scoped>
h1 {
  margin: 30px 0 30px 10px;
}

form {
  margin-bottom: 100px;
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

.fa-solid {
  margin-right: 10px;
  margin-bottom: 10px;
}

.delivery_info {
  float: right;
}

.delivery_time {
  margin-top: 6px;
  font-size: 1.1rem;
}

.order_info {
  float: left;
  font-size: 1.1rem;
}

.badge {
  position: relative;
  bottom: 3px;
  font-size: 1rem;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
  padding: 4px 10px 5px 10px;
  margin: 10px 0 20px 10px;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

.fa-qrcode {
  margin: 0;
}

.qr {
  font-size: 1.1rem;
  margin-left: 8px;
  font-weight: 500;
  position: relative;
  top: 1px;
}

.details {
  position: relative;
  padding-bottom: 70px;
  margin: 0 10px;
}
</style>
