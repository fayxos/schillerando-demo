<template>
  <div>

    <AlertPopup :title="this.alertTitle" :info="this.alertInfo"/>

    <div class="container">
      <div class="row justify-content-center">
        <div>
          <div class="card p-4 pb-0">
            <div class="card-body">
              <h1>Unternehmen Registrierung</h1>
              <p class="text-muted">Registriere dein Unternehmen auf Schillerando</p>

              <form class="needs-validation" novalidate>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                  <input type="text" id="signup-name" class="form-control" @input="validateSignUp(false)" placeholder="Name" required>

                  <div class="invalid-feedback">
                    Bitte gib deinen Vor- und Nachnamen an
                  </div>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                  <input type="email" id="signup-mail" class="form-control" data-regex="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" @input="validateSignUp(false)" placeholder="Email" required>

                  <div class="invalid-feedback">
                    Bitte gib eine gültige Email an
                  </div>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                  <input type="password" id="signup-passwd" class="form-control" @input="validateSignUp(false)" placeholder="Password" required>

                  <div class="invalid-feedback">
                    Dass Passwort muss mind. 6 Zeichen lang sein
                  </div>
                </div>
                <div class="continue">
                  <button type="button" @click="validateSignUp(true)" class="btn btn-primary px-4">
                    <div class="loading-button">Weiter</div>
                    <div class="spinner">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span class="sr-only">Loading...</span>
                    </div>  
                  </button>
                </div>
              </form>
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
      signUpPressed: false,
      action: '',
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: 'Erfolgreich',
      successAlertInfo: 'Aktion wurde erfolgreich durchgeführt',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!'
    }
  },
  computed: {
    ...mapGetters(['getState'])
  },
  watch: {
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

.card {
  position: relative;
  width: 95%;
  height: 95%;
  margin: 2.5% auto;
  text-align: left;
}

@media (max-width: 576px) {
  .card {
    text-align: center;
  }   
}

.continue {
  position: absolute;
  right: 20px;
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
</style>
