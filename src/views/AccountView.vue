<template>
  <div >

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" @click="switchCompanyMode()" unchecked>
      <label class="form-check-label" for="flexSwitchCheckChecked">Unternehmen Verwaltung</label>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div id="flipper" class="flipper col-md-8">

          <div class="card-flipper">
            <!-- Front (Account) -->
            <div class="front">
              <div class="card-group mb-0">
                <div class="card p-4" id="top-card">
                  <div class="card-body">
                    

                    <button @click.prevent="signOut">Sign out</button>
                    <p>{{ userData }}</p>
                  </div>
                </div>
                <div class="card text-white py-5 d-md-down-none bg">
                  <div class="card-body text-center">
                    
                  </div>
                </div>
              </div>
            </div>

            <!-- Back (Unternehmen) -->
            <div class="back">
              <div class="card-group mb-0">
                <div class="card p-4">
                  <div class="card-body">
                    <div v-if="this.companyData != null">
                      <label for="name">Name:</label>
                      <input type="text" name="name" v-model="this.companyData.name"><br>
                      <label for="info">Info:</label>
                      <input type="text" name="info" v-model="this.companyData.info"><br>
                      <button @click="saveChanges">Änderungen speichern</button>
                    </div>
                  </div>
                </div>
                <div class="card text-white py-5 d-md-down-none bg">
                  <div class="card-body text-center">
                    
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  </div>

</template>



<script>
import { supabase } from '../supabase'
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: 'AccountView',
  data() {
    return {
      isCompanyMode: false
    }
  },
  setup() {
    const store = useStore();
    const userData = computed(() => store.state.user);
    const companyData = computed(() => store.state.userCompany);
    const signOut = () => {
      store.dispatch("signOutAction");
    };
    return {
      signOut,
      userData,
      companyData
    };
  },
  methods: {
    switchCompanyMode() {
      var element = document.getElementById("flipper");
      element.classList.toggle("flip");
      if( window.innerWidth < 576) {
        var $ = window.jQuery = require('jquery');
        $("html, body").animate({ scrollTop: "0" });
      }
    },
    async saveChanges() {
      const { error } = await supabase
        .from('companies')
        .update({ name: this.companyData.name })
        .eq('user_uid', this.userData.id)
      if (error != null) console.log("Error signing up", error)
    }
  }
}
</script>

<style scoped>

.form-switch {
  width: fit-content;
  position: relative;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .container {
      position: relative;
      top: 0;
      left: 0;
      margin-right: 0;
      transform: translate(0, 0);
  }
}

@media (min-width: 576px) {
  .container {
      max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
      max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
      max-width: 1140px;
  }
}

.card-columns .card {
  margin-bottom: 0.75rem;
}

@media (min-width: 576px) {
  .card-columns {
      column-count: 3;
      column-gap: 1.25rem;
  }
  .card-columns .card {
      display: inline-block;
      width: 100%;
  }
}
.text-muted {
  color: #9faecb !important;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.mb-3 {
  margin-bottom: 1rem !important;
}

.input-group {
  position: relative;
  display: flex;
  width: 100%;
}

.bg {
  background-color: #00a100;
}

.bg-sec {
  background-color: white;
  color: #00a100;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

.btn-link {
  color: #00a100;
}

.btn-link:hover {
  color: #007400;
}

/* Flip */

.up {
    color: #55DD11;
}

.flipper {
    padding-left: 0px;
    padding-right: 0px;
    margin-bottom: 10px;
    perspective: 1000px;
}
    
.register:hover > .card-flipper {
    transform: rotateY(80deg);
}

.flipper.flip .card-flipper {
    transform: rotateY(180deg);
}

.flipper.flip .back {
    z-index: 3;
}
    
.card-flipper {
    text-align: center;
    width: 100%;
    height: 300px;
    position: relative;
    transition: transform 1500ms;
    transform-style: preserve-3d;
    top: 0;
    left: 0;
}
    
.front,
.back {
    width: 100%;
    padding: 5px;
    position: absolute;
    backface-visibility: hidden;
}

.front {
    z-index: 2;
}
    
.back {
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.back h2 {
    padding-bottom: 30px;
}

.front h2 {
    padding-bottom: 10px;
}
</style>

