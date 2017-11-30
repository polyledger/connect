<template>
  <div class="page container">
    <h2>Sign in to Polyledger</h2>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="alert alert-danger" role="alert" v-if="errors.nonFieldErrors">
          <div class="row">
            <div class="col-1 d-flex align-items-center">
              <i class="icon icon-warning"></i>&nbsp;
            </div>
            <div class="col-11">
              <span v-for="error in errors.nonFieldErrors">{{error}}</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <form :class="{'was-validated': validated}" novalidate>
              <div class="form-group">
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model="email" required>
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                <div class="invalid-feedback" v-if="errors.username">
                  <span v-for="error in errors.username">
                    {{error}}
                  </span>
                </div>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="password" required>
                <div class="invalid-feedback" v-if="errors.password">
                  <span v-for="error in errors.password">
                    {{error}}
                  </span>
                </div>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" v-model="remember">
                    <small>Keep me signed in</small>
                  </label>
                </div>
              </div>
              <button class="btn btn-primary btn-block" @click.prevent="handleSubmit">Sign In</button>
            </form>
          </div>
        </div>
        <div class="account-extras">
          <p><router-link to="#">Forgot password?</router-link></p>
          <p><router-link to="signup">Don't have an account?</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      email: '',
      password: '',
      remember: false,
      validated: false,
      errors: {}
    }
  },
  methods: {
    ...mapActions(['login']),
    handleSubmit () {
      let credentials = {
        email: this.email,
        password: this.password,
        remember: this.remember
      }
      this.$store.dispatch('login', credentials).catch((error) => {
        this.errors = {}
        this.errors.username = error.username
        this.errors.password = error.password
        this.errors.nonFieldErrors = error.non_field_errors
      })
      this.validated = true
    }
  }
}
</script>

<style scoped></style>
