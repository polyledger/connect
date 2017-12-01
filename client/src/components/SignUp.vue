<template>
  <div class="py-5 container">
    <h2>Create your account</h2>
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
              <div class="form-row">
                <div class="form-group col">
                  <input type="text" class="form-control" placeholder="First name" v-model="firstName" required>
                  <div class="invalid-feedback" v-if="errors.firstName">
                    <span v-for="error in errors.firstName">
                      {{error}}
                    </span>
                  </div>
                </div>
                <div class="form-group col">
                  <input type="text" class="form-control" placeholder="Last name" v-model="lastName" required>
                  <div class="invalid-feedback" v-if="errors.lastName">
                    <span v-for="error in errors.lastName">
                      {{error}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <input type="email" class="form-control" placeholder="Enter email" v-model="email" required>
                <small class="form-text text-muted">We'll never share your email with anyone else.</small>
                <div class="invalid-feedback" v-if="errors.email">
                  <span v-for="error in errors.email">
                    {{error}}
                  </span>
                </div>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" placeholder="Password" v-model="password" required>
                <div class="invalid-feedback" v-if="errors.password">
                  <span v-for="error in errors.password">
                    {{error}}
                  </span>
                </div>
              </div>
              <div class="form-group">
                <div class="g-recaptcha" data-sitekey="6Ld61DoUAAAAAIaZHZoN_bHaYdHi3nB1Y3sJel9r"></div>
              </div>
              <div class="form-group">
                <label class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" required>
                  <span class="custom-control-indicator"></span>
                  <span class="custom-control-description">
                    <small>I certify that I am 18 years of age or older, and I agree to the User Agreement and Privacy Policy.</small>
                  </span>
                </label>
              </div>
              <button class="btn btn-primary btn-block" @click.prevent="handleSubmit">Create Account</button>
            </form>
          </div>
        </div>
        <div class="account-extras">
          <p><router-link to="signin">Already have an account?</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      validated: false,
      errors: {}
    }
  },
  methods: {
    handleSubmit () {
      let credentials = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password1: this.password
      }
      this.$http({
        url: '/account/signup/',
        method: 'POST',
        data: credentials
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error.response)
        this.errors = {}
        this.errors.firstName = error.response.data.first_name
        this.errors.lastName = error.response.data.last_name
        this.errors.email = error.response.data.email
        this.errors.password = error.response.data.password
        this.errors.nonFieldErrors = error.response.data.non_field_errors
      })
      this.validated = true
    }
  }
}
</script>

<style scoped>
.custom-control-indicator {
  background-color: #ccc;
}
</style>
