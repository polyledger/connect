<template>
  <div class="py-5 container">
    <h2>Create your account</h2>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <form :class="{'was-validated': validated}" novalidate>
              <div class="form-row">
                <div class="form-group col">
                  <input type="text" class="form-control" id="first_name" placeholder="First name" v-model="firstName" required>
                </div>
                <div class="form-group col">
                  <input type="text" class="form-control" placeholder="Last name" v-model="lastName" required>
                </div>
              </div>
              <div class="form-group">
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model="email" required>
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="password" required>
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
        password: this.password
      }
      this.$http({
        url: '/account/signup/',
        method: 'post',
        data: credentials
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error.response.data)
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
