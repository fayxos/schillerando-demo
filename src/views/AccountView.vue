<template>
  <div>

    <AlertPopup :title="this.alertTitle" :info="this.alertInfo"/>

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
            <button @click="$router.push('/companyRegistration')" class="btn bg-sec register">Unternehmen Registrieren</button>
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
              <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Informationen
                    </button>
                  </h2>
                  <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <form class="needs-validation" novalidate>
                        <div class="input-group mb-3">
                          <span class="input-group-text"><i class="fa-solid fa-shop"></i></span>
                          <input type="text" id="company-name" class="form-control" placeholder="Name" @input="validateCompanyChange(false)" :value="companyData.name" required disabled>
                        </div>
                        <div class="input-group mb-3">
                          <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                          <input type="text" id="company-location" class="form-control" placeholder="Raum, Pausenhof, ..." @input="validateCompanyChange(false)" :value="companyData.location" required disabled>
                        </div>
    
                        
    
                        <div class="input-group mb-3">
                          <span class="input-group-text"><i class="fa-solid fa-list"></i></span>
                          <select class="form-select" id="company-category" aria-label="Default select example" :value="companyData.category" @change="validateCompanyChange(false)" disabled>
                            <option selected>Kategorie</option>
                            <option value="1">Gastronomie</option>
                            <option value="2">Kultur</option>
                            <option value="3">Dienstleistung</option>
                            <option value="4">Gastronomie & Dienstleistung</option>
                          </select>
                        </div>
    
                        <div class="input-group mb-3">
                          <span class="input-group-text"><i class="fa-solid fa-circle-info"></i></span>
                          <textarea type="text" id="company-info" class="form-control" placeholder="Beschreibung" required maxlength="400" style="resize: none;" rows="5" cols="50" @input="validateCompanyChange(false)" :value="companyData.info" disabled></textarea>
                        </div>
                      </form>

                      <div v-if="!isCompanyEditing" class="py-2" style="width: fit-content;">
                        <button type="button" class="btn btn-primary px-2 mx-2" @click="editCompany()">Bearbeiten</button>
                      </div>
                      <div v-else class="py-2" style="width: fit-content;">
                        <button type="button" class="btn btn-primary px-2 mx-2" @click="validateCompanyChange(true)">
                          <div class="loading-button">Speichern</div>
                          <div class="spinner">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span class="sr-only">Loading...</span>
                          </div> 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Mitarbeiter
                    </button>
                  </h2>
                  <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div v-for="(employee, index) in this.employees" :key="employee">
                        <div class="input-group mb-3">
                          <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                          <input type="email" class="form-control signup-mail" placeholder="Email" data-regex="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" :value="employees[index]" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Produkte
                    </button>
                  </h2>
                  <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <div v-for="product in this.products" :key="product">
                        {{ product }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
import { reactive } from "vue";
import { useStore, mapGetters } from "vuex"
import { computed } from "vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";
import AlertPopup from '../components/AlertPopup.vue'

export default {
  name: 'AccountView',
  components: {
    AlertPopup
  },
  data() {
    return {
      isCompanyMode: false,
      isAccountEditing: false,
      isCompanyEditing: false,
      saveCompanyPressed: false,
      orders: [], 
      employees: [],
      products: [], 
      alertTitle: 'Name schon vergeben',
      alertInfo: 'Es gibt bereits ein Unternehmen mit diesem Namen. Bitte wähle einen anderen!',
    }
  },
  computed: {
    ...mapGetters(['getState'])
  },
  setup() {
    const store = useStore();

    const userData = computed(() => store.state.user);
    const companyData = computed(() => store.state.userCompany);
    const signOut = () => {
      store.dispatch("signOutAction");
    };

    const form = reactive({
      name: "",
      location: "",
      category: "Kategorie",
      description: "",
      employees: [''],
      products: [],
      abo: ""
    });

    const product = reactive({
      name: "",
      description: "",
      categories: [],
      price: "",
    });

    return {
      signOut,
      store,
      userData,
      companyData,
      form,
      product
    };
  },
  watch: {
    companyData: function() {
      this.employees = this.companyData.employees
      this.loadProducts()
    },
    getState(newValue) {
      var spinners = document.getElementsByClassName("spinner");
      var loadingButtons = document.getElementsByClassName("loading-button");

      if(newValue == 'loading') {
        Array.from(spinners).forEach(spinner => {
          spinner.style.visibility = "visible";
          spinner.style.position = "relative";
        })

        Array.from(loadingButtons).forEach(button => {
          button.style.visibility = "hidden";
          button.style.position = "absolute";
        })
      }
      else if(newValue == 'success') {
        Array.from(spinners).forEach(spinner => {
          spinner.style.visibility = "hidden";
          spinner.style.position = "absolute";
        })

        Array.from(loadingButtons).forEach(button => {
          button.style.visibility = "visible";
          button.style.position = "relative";
        })
      }
      else {
        Array.from(spinners).forEach(spinner => {
          spinner.style.visibility = "hidden";
          spinner.style.position = "absolute";
        })

        Array.from(loadingButtons).forEach(button => {
          button.style.visibility = "visible";
          button.style.position = "relative";
        })

        if(this.alertTitle == '') return;
        var alertModal = new Modal(document.getElementById("alertModal"), {});
        alertModal.show();
      }
    }
  },
  async created() {
    const { data, error } = await supabase
          .from('orders')
          .select()
          .eq('buyer', this.userData.id)

    if (error) throw error

    this.orders = data
    this.employees = this.companyData.employees

    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      const { data, error } = await supabase
          .from('products')
          .select()
          .eq('company_id', this.companyData.id)

      if (error) throw error
      this.products = data
    },
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
    editCompany() {
      this.isCompanyEditing = true

      var nameInput = document.getElementById("company-name");
      var locationInput = document.getElementById("company-location");
      var categoryInput = document.getElementById("company-category");
      var descriptionInput = document.getElementById("company-info");
      nameInput.disabled = false
      locationInput.disabled = false
      categoryInput.disabled = false
      descriptionInput.disabled = false
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
    async validateCompanyChange(pressed) {
      if(!pressed && !this.saveCompanyPressed) return;

      var nameInput = document.getElementById("company-name");
      var locationInput = document.getElementById("company-location");
      var categoryInput = document.getElementById("company-category");
      var descriptionInput = document.getElementById("company-info");
      
      if(pressed) nameInput.value = nameInput.value.trim();
      if(pressed) locationInput.value = locationInput.value.trim();
      if(pressed) descriptionInput.value = descriptionInput.value.trim();
      var valid = true

      if(nameInput.value.trim().length < 3) {
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        valid = false;
      }
      else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
      }

      if(locationInput.value.trim().length < 3 || locationInput.value.trim().length > 40) {
        locationInput.classList.remove("is-valid");
        locationInput.classList.add("is-invalid");
        valid = false;
      }
      else {
        locationInput.classList.remove("is-invalid");
        locationInput.classList.add("is-valid");
      }

      if(categoryInput.value == 'Kategorie') {
        categoryInput.classList.remove("is-valid");
        categoryInput.classList.add("is-invalid");
        valid = false;
      }
      else {
        categoryInput.classList.remove("is-invalid");
        categoryInput.classList.add("is-valid");
      }

      if(descriptionInput.value.trim().length < 10) {
        descriptionInput.classList.remove("is-valid");
        descriptionInput.classList.add("is-invalid");
        valid = false;
      }
      else {
        descriptionInput.classList.remove("is-invalid");
        descriptionInput.classList.add("is-valid");
      }

      this.continuePressed = true;

      if(valid && pressed) {

        this.store.commit('setState', 'loading')

        if(nameInput.value.replace(/\s/g,'').toLowerCase() != this.companyData.id) {
          const { data, error } = await supabase
          .from('companies')
          .select()
          .eq('id', nameInput.value.replace(/\s/g,'').toLowerCase())

          if(error || data[0] != null) {
            this.store.commit('setState', 'failure')
            nameInput.classList.remove("is-valid");
            nameInput.classList.add("is-invalid");

            this.form.name = nameInput.value
            this.form.location = locationInput.value
            this.form.category = categoryInput.value
            this.form.description = descriptionInput.value

            return
          } 
        }

        this.form.name = nameInput.value
        this.form.location = locationInput.value
        this.form.description = descriptionInput.value
        this.form.category = categoryInput.value

        this.saveCompany()
      } 
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

      if(capitalizedName != this.userData.user_metadata.name) {
        
        const { data, error } = await supabase.auth.updateUser({data: { name: capitalizedName } })

        if (error) throw error;

        console.log(data.user)
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
    },
    async saveCompany() {
      try {
        this.isCompanyEditing = false
        this.saveCompanyPressed = false

        var nameInput = document.getElementById("company-name");
        var locationInput = document.getElementById("company-location");
        var categoryInput = document.getElementById("company-category");
        var descriptionInput = document.getElementById("company-info");

        const { data, error } = await supabase
          .from('companies')
          .update({
            id: this.form.name.replace(/\s/g,'').toLowerCase(),
            name: this.form.name,
            category: this.form.category,
            location: this.form.location,
            info: this.form.description,
          })
          .eq('id', this.companyData.id)
          .select()

        if (error) throw error;

        this.store.commit('setUserCompany', data[0])
        this.store.commit('setState', 'success')

        nameInput.disabled = true
        locationInput.disabled = true
        categoryInput.disabled = true
        descriptionInput.disabled = true
        nameInput.classList.remove("is-valid");
        nameInput.classList.remove("is-invalid");
        locationInput.classList.remove("is-valid");
        locationInput.classList.remove("is-invalid");
        categoryInput.classList.remove("is-valid");
        categoryInput.classList.remove("is-invalid");
        descriptionInput.classList.remove("is-valid");
        descriptionInput.classList.remove("is-invalid");
      } catch (error) {
        this.store.commit('setState', 'failure')
        console.log(error.error_description || error.message);
      }
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


.input-group-text {
  width: 40px;
  padding: 0;
  padding-left: 10px;
}

.fa-location-dot {
  position: relative;
  left: 3px;
}

.spinner {
  visibility: hidden;
  position: absolute;
}

</style>

