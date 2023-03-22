<template>
  <div>
    <!-- Log in -->
    <div class="container">
      <div class="row justify-content-center">
        <div id="flipper" class="flipper col-md-8">

          <div class="card-flipper">
            <!-- Front -->
            <div class="front">
              <div class="card-group mb-0">
                <div class="card p-4" id="top-card">
                  <div class="card-body">
                    <h1>Login</h1>
                    <p class="text-muted">Melde dich mit deinem Account an</p>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                      <input id="login-mail" type="email" class="form-control" placeholder="Email">
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-lock"></i></span>
                      <input id="login-passwd" type="password" class="form-control" placeholder="Password">
                    </div>
                    <div class="row">
                      <div class="col-5">
                        <button type="button" @click="signIn" class="btn btn-primary px-4">Login</button>
                      </div>
                      <div class="col-7 text-right">
                        <button type="button" class="btn btn-link px-0">Passwort vergessen?</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card text-white py-5 d-md-down-none bg">
                  <div class="card-body text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Du hast noch keinen Account? Dann registriere dich jetzt um Bestellungen zu tätigen oder dein Unternehmen anzumelden!</p>
                      <button type="button" @click="flipCard" class="btn bg-sec mt-3 register">Registrieren</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back -->
            <div class="back">
              <div class="card-group mb-0">
                <div class="card p-4">
                  <div class="card-body">
                    <h1>Sign up</h1>
                    <p class="text-muted">Erstelle einen neuen Account</p>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-user"></i></span>
                      <input type="text" id="signup-name" class="form-control" placeholder="Name">
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                      <input type="email" id="signup-mail" class="form-control" placeholder="Email">
                    </div>
                    <div class="input-group mb-3">
                      <span class="input-group-text"><i class="fa fa-lock"></i></span>
                      <input type="password" id="signup-passwd" class="form-control" placeholder="Password">
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <button type="button" @click="signUp" class="btn btn-primary px-4">Registrieren</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card text-white py-5 d-md-down-none bg">
                  <div class="card-body text-center">
                    <div>
                      <h2>Log in</h2>
                      <p>Du hast schon einen Account? Dann melde dich mit deiner Email und deinem Passwort an!</p>
                      <button type="button" @click="flipCard" class="btn bg-sec mt-3 register">Log in</button>
                    </div>
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
import { supabase } from '../main.js'

export default {
  name: 'LoginSignup',
  props: {
    title: String,
  },
  data() {
    return {
      auth: { user: null, session: null },
      company: []
    }
  },
  methods: {
    flipCard() {
      var element = document.getElementById("flipper");
      element.classList.toggle("flip");
      if( window.innerWidth < 576) {
        var $ = window.jQuery = require('jquery');
        $("html, body").animate({ scrollTop: "0" });
      }
    },
    async signIn() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('login-mail').value,
        password: document.getElementById('login-passwd').value,
      })
      this.auth = data
      if (error != null) console.log("Error logging in", error)
      //Download corresponding company data
      this.company = (await supabase
        .from('companies')
        .select()
        .eq('user_uid', this.auth.user.id)).data
    },
    async signUp() {
      const { data, error } = await supabase.auth.signUp({
        email: document.getElementById('signup-mail').value,
        password: document.getElementById('signup-passwd').value,
      })
      this.auth = data
      if (error != null) console.log("Error signing up", error)
    }
  }
}
</script>

<style scoped>
.position {
  height: 500px;
}

.container {
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
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
