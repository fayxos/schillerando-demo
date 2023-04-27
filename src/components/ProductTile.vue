<template>
  <div class="card">
    <div>
      <img src="" alt="" />
      <div class="no-image"></div>
    </div>
    <div>
      <p class="name">{{ data.name }}</p>
    </div>
    <div>
      <p class="price">{{ data.price }} $</p>
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

.price {
  position: absolute;
  right: 10px;
}

.card {
  flex-direction: row;
  padding-top: 20px;
  margin: 15px 15px;
}
</style>
