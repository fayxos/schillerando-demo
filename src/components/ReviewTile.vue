<template>
  <div class="card">
    <div class="header">
      <div>
        <h6 v-if="data.anonym || data.users == null">Anonym</h6>
        <h6 v-else>{{ data.users.name }}</h6>
      </div>

      <div class="stars">
        <div v-for="star in [0, 1, 2, 3, 4]" :key="star">
          <i
            v-if="star < data.stars"
            class="fa-solid fa-star fa-lg solid-star"
          ></i>
          <i v-else class="fa-regular fa-star fa-lg"></i>
        </div>
      </div>
    </div>

    <div class="info">
      <p class="text">{{ data.text }}</p>
    </div>

    <div class="date">
      <p>{{ date }} • {{ time }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { reformatDate } from "../helpers.js";

export default {
  name: 'ReviewTile',
  props: ['data'],
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  data() {
    return {
      date: '',
      time: '',
    };
  },
  mounted() {
    this.date = reformatDate(this.data.created_at.split(' ')[0]) //+ this.data.created_at.split('+00')[1];
    this.time = this.data.created_at.split(' ')[1].split(":")[0] + ":" + this.data.created_at.split(' ')[1].split(":")[1];
  },
};
</script>

<style scoped>
.fa-star {
  margin-right: 5px;
}

.solid-star {
  color: #e3c100;
}

.stars {
  display: flex;
  position: absolute;
  right: 5px;
  top: 5px;
}

.header {
  margin: 5px 5px 0 10px;
}

h6 {
  font-size: 1.2rem;
  position: relative;
  top: 3px;
  max-width: calc(100% - 150px);
}

.info {
  margin: 0 10px;
}

.text {
  margin: 0 0 5px 0;
}

.date {
  margin: 0 10px 5px 10px;
  font-size: 0.8rem;
  color: grey;
}

p {
  margin: 0;
}
</style>
