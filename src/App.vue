<template>
  <div>
    <NavBar/>
    <router-view></router-view>
    <SocialsFooter v-if="$route.meta.footer == null"/>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import SocialsFooter from './components/SocialsFooter'

export default {
  name: 'App',
  components: {
    NavBar,
    SocialsFooter
  }
}
</script>

<style>

::-webkit-scrollbar {
  position: absolute;
  z-index: 9999;
}

body {
  font-family: "Merriweather Sans",Arial,sans-serif;
  text-align: center; 
  font-weight: 500;
  scrollbar-gutter: stable;
}

h1 {
  font-weight: 900;
}

h2 {
  font-weight: 900;
}

h3 {
  font-weight: 700;
}

a {
  color: #000;
  text-decoration: none;
}

li {
  padding: 10px 0;
}

hr {
  padding: 0;
  margin: 0;
  color: #b1afaf;
}

.row {
  padding: 50px 0;
}

/* Primary Styles */

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
}

.bg-primary {
  background-color: #00a100;
  color: #00a100;
}

</style>
