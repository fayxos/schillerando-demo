<template>
  <hr>
  <header class="navbar navbar-expand-lg navbar-light sticky-top">
    <router-link to="/" class="brand navbar-brand">
      <img class="logo" src="@/assets/logo_transparent.png"/>
      Schillerando
    </router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarToggler">
        <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <router-link class="nav-link" to="/produkte">Produkte</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/unternehmen">Unternehmen</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/account">Account</router-link>
            </li>
        </ul>
    </div>
  </header>
</template>


<style scoped>

.navbar {
  -webkit-box-shadow: 0 8px 6px -6px #b1afaf;
  -moz-box-shadow: 0 8px 6px -6px #b1afaf;
  box-shadow: 0 8px 6px -6px #b1afaf;

  margin: 0 -10px;
  padding: 12px 20px;
  text-align: left;
  background-color: white;
  
}

.navbar-brand {
  font-size: 1.5rem;
  color: #00a100; 
  font-weight: 900;
  position: relative;
  top: 5px;
}

.navbar-brand:hover {
  color: #00a100;
}

.nav-item {
  padding: 0 18px;
}

.nav-link {
  font-size: 1.2em;
  color: #000;
}

.logo {
  height: 40px;
  padding: 0 10px;
  position: relative;
  bottom: 5px;
}

@media (max-width: 991px) {
  label {
    position: static;
  }

  br {
    content: '';
  }
}

</style>
