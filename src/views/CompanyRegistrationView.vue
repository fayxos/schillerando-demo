<template>
  <div>

    <AlertPopup :title="this.alertTitle" :info="this.alertInfo"/>

    <div class="container">
      <div class="row justify-content-center">
        <div>

          <div class="card container-card p-4 pb-0">
            <div class="card-body">
              <h1>Unternehmen Registrierung</h1>
              <p class="text-muted">Registriere dein Unternehmen auf Schillerando</p>

              <!-- 0 -->
              <div v-if="this.page == 0" class="row">

                <div class="col-md-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/M%C3%BCnster%2C_LVM%2C_B%C3%BCrogeb%C3%A4ude_--_2013_--_5149-51.jpg" alt="">

                  <input class="form-control form-control-sm col-7" type="file" id="formFile" accept="image/*">

                </div>

                <div class="col-md-8">
                  <form class="needs-validation" novalidate>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa-solid fa-shop"></i></span>
                      <input type="text" id="signup-name" class="form-control" @input="validateSignUp(false)" placeholder="Name" required>
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                      <input type="text" id="signup-location" class="form-control" @input="validateSignUp(false)" placeholder="Raum, Pausenhof, ..." required>
                    </div>

                    

                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa-solid fa-list"></i></span>
                      <select class="form-select" aria-label="Default select example">
                        <option selected>Kategorie</option>
                        <option value="1">Gastronomie</option>
                        <option value="2">Kultur</option>
                        <option value="3">Dienstleistung</option>
                        <option value="3">Gastronomie & Dienstleistung</option>
                      </select>
                    </div>

                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa-solid fa-circle-info"></i></span>
                      <textarea type="text" id="signup-info" class="form-control" @input="validateSignUp(false)" placeholder="Beschreibung" required maxlength="400" style="resize: none;" rows="5" cols="50"></textarea>
                    </div>
                  </form>
                </div>
                
              </div>

              <!-- 1 -->
              <div v-else-if="this.page == 1">

                <h5 class="pt-4">Füge Mitarbeiter hinzu, damit sie bei der Verwaltung deines Unternehmens helfen können!</h5>
                
                <div class="py-3 row">
                  <div class="col-md-6" v-for="employee in employes" :key="employee">
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                      <input id="login-mail" type="email" class="form-control" placeholder="Email" @input="validateSignIn(false)" data-regex="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" :value="employee" required />
                    </div>
                  </div>
                </div>
                
                <button type="button" v-if="this.employes.length < 6" @click="this.employes.push('')" class="btn btn-primary col-md-9 mb-5" style="width: max-content;">
                  <div class="loading-button">Mitarbeiter hinzufügen</div>
                  <div class="spinner">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                  </div>  
                </button>

              </div>

              <!-- 2 -->
              <div v-else-if="this.page == 2">

                Produkte hinzufügen
                
              </div>

              <!-- 3 -->
              <div v-else-if="this.page == 3">

                <h4 class="pt-4">Abo wählen</h4>
                
                <div class="row abo flex-card">
                  <div class="col-lg-4">
                    <div class="card mb-4 rounded-3 shadow-sm">
                      <div class="card-header py-3">
                        <h4 class="info-title my-0 fw-normal">Delivery</h4>
                      </div>
                      <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                          <li class="info-text">Offizieller Schillerando Partner</li>
                          <li class="info-text">Blauer Haken</li>
                          <li class="info-text">Eigener QR-Code</li>
                          <li class="info-text">Lieferungen mit 10% Kosten pro Lieferung</li>
                        </ul>
                      </div>
                      <div class="card-footer">
                        <h3 class="mt-2">50$ (5€)</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="card mb-4 rounded-3 shadow-sm">
                      <div class="card-header py-3">
                        <h4 class="info-title my-0 fw-normal">Delivery+</h4>
                      </div>
                      <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                          <li class="info-text">Kostenlose Lieferungen</li>
                          <li class="info-text">Kostenlose Services, wie Müllentsorgung etc</li>
                          <li class="info-text">Lieferung von Waren</li>
                        </ul>
                      </div>
                      <div class="card-footer">
                        <h3 class="mt-2">150$ (15€)</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="card mb-4 rounded-3 shadow-sm">
                      <div class="card-header py-3">
                        <h4 class="info-title my-0 fw-normal">Premium</h4>
                      </div>
                      <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                          <li class="info-text">Schillerando Premium Partner</li>
                          <li class="info-text">Bevorzugung auf Website</li>
                          <li class="info-text">Werbung</li>
                          <li class="info-text">kostenlose Lieferung von Waren</li>
                        </ul>
                      </div>
                      <div class="card-footer">
                        <h3 class="mt-2">250$ (25€)</h3>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="card mb-3 rounded-3 shadow-sm" style="text-align: center;">
                      <div class="card-body">
                        ODER: Kostenlose Registrierung ohne Lieferungen (kann später upgegradet werden)
                      </div>
                    </div>
                  </div>
                  
                </div>

              </div>

              <!-- 4 -->
              <div v-else-if="this.page == 4">

                Unternehmen registrieren
                
              </div>

              <div style="height: 50px;"></div>

              <div class="back" v-if="this.page > 0">
                <button type="button" @click="this.page--" class="btn btn-secondary">
                  <div class="loading-button">Zurück</div>
                  <div class="spinner">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                  </div>  
                </button>
              </div>

              <div class="skip" v-if="this.page == 1 || this.page == 2">
                <button type="button" @click="this.page++" class="btn btn-secondary">
                  <div class="loading-button">Später</div>
                  <div class="spinner">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                  </div>  
                </button>
              </div>

              <div class="continue" v-if="this.page != 4">
                <button type="button" @click="this.page++" class="btn btn-primary">
                  <div class="loading-button">Weiter</div>
                  <div class="spinner">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                  </div>  
                </button>
              </div>
              
            </div>
          </div>

          <div class="container">
            <div class="progress" style="height: 20px;">
              <div class="progress-bar" id="progress" role="progressbar" aria-label="Example 20px high" style="width: 20%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { reactive } from "vue";
import { useStore, mapGetters } from "vuex";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";
import AlertPopup from '../components/AlertPopup.vue'

export default {
  name: 'CompanyRegistrationView',
  components: {
    AlertPopup
  },
  data() {    
    return {
      page: 3,
      signUpPressed: false,
      action: '',
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: 'Erfolgreich',
      successAlertInfo: 'Aktion wurde erfolgreich durchgeführt',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!',
      employes: ['']
    }
  },
  computed: {
    ...mapGetters(['getState'])
  },
  watch: {
    page: function() {
      const progressBar = document.getElementById('progress')
      progressBar.style.width = (this.page+1)*20 + '%'
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

        this.alertTitle = this.successAlertTitle
        this.alertInfo = this.successAlertInfo

        if(this.alertTitle == '') return;
        alertModal = new Modal(document.getElementById("alertModal"), {});
        alertModal.show();
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

        this.alertTitle = this.failureAlertTitle
        this.alertInfo = this.failureAlertInfo

        if(this.alertTitle == '') return;
        var alertModal = new Modal(document.getElementById("alertModal"), {});
        alertModal.show();

        if(this.action == 'login') {
          this.signInFailure()
        }
        else if(this.action == 'register') {
          this.signUpFailure()
        }
      }
    }
  },
  setup() {
    const form = reactive({
      name: "",
      email: "",
    });
    const store = useStore();

    return {
      store,
      form,
    };
  },
  methods: {
    validateSignUp(pressed) {
      if(!pressed && !this.signUpPressed) return;

      var feedbacks = document.getElementsByClassName("invalid-feedback");
      Array.from(feedbacks).forEach(feedback => {
        feedback.style.visibility = "visible";
        feedback.style.position = "relative";
      })

      var nameInput = document.getElementById("signup-name");
      var mailInput = document.getElementById("signup-mail");
      var passwInput = document.getElementById("signup-passwd");
      if(pressed) nameInput.value = nameInput.value.trim();
      mailInput.value = mailInput.value.replace(/\s/g,'');
      passwInput.value = passwInput.value.replace(/\s/g,'');
      var nameValid = false;
      var mailValid = false;
      var passwValid = false;

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

      if(passwInput.value.length < 6) {
        passwInput.classList.remove("is-valid");
        passwInput.classList.add("is-invalid");
      }
      else {
        passwInput.classList.remove("is-invalid");
        passwInput.classList.add("is-valid");
        passwValid = true;
      }

      this.signUpPressed = true;

      if(passwValid && mailValid && nameValid && pressed) this.signUp();
    },
    signUp() {
      this.form.name = document.getElementById('signup-name').value
      this.form.email = document.getElementById('signup-mail').value
      this.form.password = document.getElementById('signup-passwd').value

      this.store.dispatch("signUpAction", { form: this.form, path: this.$route.query.redirect });

      this.failureAlertTitle = 'Registrierung fehlgeschlagen';
      this.failureAlertInfo = 'Es existiert bereits ein Account mit dieser Email!';
      this.successAlertTitle = ''
 
      this.action = 'register'
    },
    signUpFailure() {
      var mailInput = document.getElementById("signup-mail");
      mailInput.classList.remove("is-valid");
      mailInput.classList.add("is-invalid");

      var feedbacks = document.getElementsByClassName("invalid-feedback");
      Array.from(feedbacks).forEach(feedback => {
        feedback.style.visibility = "hidden";
        feedback.style.position = "absolute";
      })
    },
    removeValidation() {
      const mailInput = document.getElementById('reset-mail');
      mailInput.value = '';
      mailInput.classList.remove("is-valid");
      mailInput.classList.remove("is-invalid");
    }
    
  }
}
</script>

<style scoped>

.container-card {
  position: relative;
  width: 95%;
  height: 95%;
  margin: 2.5% auto;
  text-align: left;
}

@media (max-width: 576px) {
  .container-card {
    text-align: center;
  }   
}

.continue {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.back {
  position: absolute;
  left: 20px;
  bottom: 20px;
}

.skip {
  position: absolute;
  right: 110px;
  bottom: 20px;
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

.spinner {
  visibility: hidden;
  position: absolute;
}

img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.progress-bar {
  background-color: #00a100;
}

.progress {
  margin: 0 10px;
}

span {
  width: 40px;
  padding: 0;
  padding-left: 10px;
}

#formFile {
  margin-bottom: 50px; 
}

.abo .card {
  text-align: center;
}

.flex-card > div > div.card {
  height: calc(100% - 15px);
  margin-bottom: 15px;
}


</style>
