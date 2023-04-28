<template>
  <div class="card">
    <div class="image">
      <div v-if="data.product_picture == null" class="no-image"></div>
      <img v-else src="@/assets/cola.png" alt="" />
    </div>
    <div class="info">
      <div class="row">
        <div>
          <p class="name">{{ data.name }}</p>
        </div>
        <div>
          <p class="price">{{ data.price }} $</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductTile',
  props: ['data'],
};
</script>

<style scoped>
.price,
.name {
  font-size: 1.25rem;
}

.info {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 42.5%;
}

.card {
  flex-direction: row;
  overflow: hidden;
}

.image {
  width: 40%;
  position: relative;
  padding-bottom: 40%;
  margin-right: 10px;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  border-radius: 0.375rem 0 0 0.375rem;
}

img {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  object-fit: scale-down;
  border-radius: 0.375rem 0 0 0.375rem;
}
</style>
