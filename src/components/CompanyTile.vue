<template>
    <div class="container-fluid">
      <p>{{ companyObject.name }}</p>
      <p v-for="category in companyObject.categories" :key="category">{{ category }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CompanyTile',
    props: ["companyObject"]
  }
  </script>
