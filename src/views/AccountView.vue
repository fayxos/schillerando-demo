<template>
  <div >

    <div class="container">

      <div class="row mb-0">

        <div class="col-md-4">

          <div class="card">
            <div class="row py-3">
              <div class="credit col-5 py-1">
                <i class="fa-solid fa-credit-card fa-2xl"></i>
              </div>
              <div class="credit col-7 credit-number py-1">
                {{ this.userData.user_metadata.credit }} $
              </div>
            </div>
          </div>

          <div class="card">
            <div class="row py-3">
              <form class="needs-validation" novalidate>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                  <input type="text" id="account-name" class="form-control" @input="validateAccountChange(false)" placeholder="Name" :value="this.userData.user_metadata.name" required disabled>

                  <div class="invalid-feedback">
                    Bitte gib deinen Vor- und Nachnamen an
                  </div>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                  <input type="email" id="account-mail" class="form-control" data-regex="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" @input="validateAccountChange(false)" placeholder="Email" :value="this.userData.email" required disabled>

                  <div class="invalid-feedback">
                    Bitte gib eine gültige Email an
                  </div>
                </div>
              </form>
              <div v-if="!isAccountEditing" class="py-2" style="display: inline; float: left; width: fit-content;">
                <button type="button" class="btn btn-primary px-2 mx-2" @click="editAccount">Bearbeiten</button>
              </div>
              <div v-else class="py-2" style="display: inline; float: left; width: fit-content;">
                <button type="button" class="btn btn-primary px-2 mx-2" @click="validateAccountChange(true)">Speichern</button>
              </div>
              <div class="py-2" style="display: inline; float: left; width: fit-content;">
                <button type="button" class="btn btn-danger px-2 mx-2" @click.prevent="signOut">Abmelden</button>
              </div>
            </div>
          </div>
          
          <div class="card action p-4" v-if="companyData == null">
            <p>
              Du hast ein eigenes Unternehmen bei Schule als Staat?
            </p>
            <button type="submit" class="btn bg-sec register">Unternehmen Registrieren</button>
          </div>

          <div class="card action p-4" v-else>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" @click="switchCompanyMode()" unchecked>
              <label class="form-check-label" for="flexSwitchCheckChecked">Unternehmen Verwaltung</label>
            </div>
          </div>
        </div>

        <div class="col-md-8" v-if="this.isCompanyMode">
          <div class="card">
            <div class="card-header">
              Unternehmen
            </div>
            <div class="card-body">
              <p>Hier kannst du dein Unternehmen verwalten</p>
            </div>
          </div>
        </div>

        <div class="col-md-8" v-else>
          <div class="card">
            <div class="card-header">
              Bestellungen
            </div>
            <div class="card-body">
              <p  v-if="this.orders.length == 0">Hier siehst du alle deine getätigten Bestellungen</p>

              <div class="order" v-for="order in this.orders" :key="order">
                
                <div class="card d-flex">
                    <div class="product-count" v-if="order.products != null">
                      {{ order.products.length }} <i class="fa-solid fa-bag-shopping"></i>
                    </div>
                    <div class="product-count" v-else>
                      0 <i class="fa-solid fa-bag-shopping"></i>
                    </div>
                    <div class="price">
                      {{ order.order_price }} $
                    </div>
                    <div>
                      {{ order.deliver_to }}
                    </div>
                    <div>
                      {{ order.payed }}
                    </div>
                    <div>
                      {{ order.delivered }}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      
        <!--
      <div class="card-group mb-0">
        <div class="card p-4" id="top-card">
          <div class="card-body">
            

            <button @click.prevent="signOut">Sign out</button>
            <p>{{ userData }}</p>
          </div>
        </div>
      </div>

        
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
      </div>
      -->
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
      isCompanyMode: false,
      isAccountEditing: false,
      saveAccountPressed: false,
      orders: [], 
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
      store,
      userData,
      companyData
    };
  },
  async created() {
    const { data, error } = await supabase
          .from('orders')
          .select()
          .eq('buyer', this.userData.id)
    console.log(data)
    if (error != null) console.log(error)
    this.orders = data
  },
  methods: {
    switchCompanyMode() {
      this.isCompanyMode = !this.isCompanyMode
    },
    async saveChanges() {
      const { error } = await supabase
        .from('companies')
        .update({ name: this.companyData.name })
        .eq('user_uid', this.userData.id)
      if (error != null) console.log("Error signing up", error)
    },
    editAccount() {
      this.isAccountEditing = true

      var nameInput = document.getElementById("account-name");
      var mailInput = document.getElementById("account-mail");
      nameInput.disabled = false
      mailInput.disabled = false
    },
    validateAccountChange(pressed) {
      if(!pressed && !this.saveAccountPressed) return;

      var feedbacks = document.getElementsByClassName("invalid-feedback");
      Array.from(feedbacks).forEach(feedback => {
        feedback.style.visibility = "visible";
        feedback.style.position = "relative";
      })

      var nameInput = document.getElementById("account-name");
      var mailInput = document.getElementById("account-mail");
      if(pressed) nameInput.value = nameInput.value.trim();
      mailInput.value = mailInput.value.replace(/\s/g,'');
      var nameValid = false;
      var mailValid = false;

      if(!nameInput.value.trim().includes(' ') || nameInput.value.length < 5) {
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
      }
      else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
        nameValid = true;
      }

      var regex = mailInput.getAttribute('data-regex');
      if(!mailInput.value.match(regex)) {
        mailInput.classList.remove("is-valid");
        mailInput.classList.add("is-invalid");
      }
      else {
        mailInput.classList.remove("is-invalid");
        mailInput.classList.add("is-valid");
        mailValid = true;
      }

      this.saveAccountPressed = true;

      if(mailValid && nameValid && pressed) this.saveAccount();
    },
    async saveAccount() {
      this.isAccountEditing = false
      this.saveAccountPressed = false

      var nameInput = document.getElementById("account-name");
      var mailInput = document.getElementById("account-mail");

      const splitName = nameInput.value.split(' ')
      const name1 = splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1).toLowerCase()
      const name2 = splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1).toLowerCase()
      
      const capitalizedName = name1 + ' ' + name2

      if(capitalizedName != this.userData.name) {
        

        const { data, error } = await supabase.auth.updateUser({data: { name: capitalizedName } })

        if (error) throw error;
        this.store.commit('setUser', data.user)
        
      }

      if(mailInput.value != this.userData.email) {
        const { data, error } = await supabase.auth.updateUser({email: mailInput.value })

        if (error) throw error;

        this.store.commit('setUser', data.user)
      }

      nameInput.disabled = true
      mailInput.disabled = true
      nameInput.classList.remove("is-valid");
      nameInput.classList.remove("is-invalid");
      mailInput.classList.remove("is-valid");
      mailInput.classList.remove("is-invalid");
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

.container {
  position: relative;
  text-align: center; 
  width: 96%;
  padding: 0;
  margin: 50px auto;
  font-size: 1.1rem;
}

.card {
  margin: 10px 0;
}

.row {
  margin: 0;
  padding: 0;
}

.d-flex {
  flex-direction: row;
}

.credit {
  margin: auto 0;
  font-size: 1.5rem;
  font-weight: 300;
}

.credit-number {
  font-size: 2rem;
  font-weight: 600;
}

.data {
  text-align: left;
  font-weight: 300;
}

.action {
  background-color: #00a100;
  color: white;
}

.register {
  width: fit-content;
  margin: 0 auto;
}

.order .card div {
  margin: 5px 10px;
}

.product-count {
  width: 40px;
}

.product-count i {
  margin-left: 2px;
}

.price {
  width: 70px;
}

</style>

