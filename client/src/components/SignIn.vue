<template>
  <div class="page container">
    <h2>Sign in to Polyledger</h2>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <form>
              <div class="form-group">
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model="email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
              </div>
              <div class="form-group">
                <div class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input" type="checkbox">
                    <small>Keep me signed in</small>
                  </label>
                </div>
              </div>
              <button class="btn btn-primary btn-block" @click="handleSubmit">Sign In</button>
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
export default {
  name: 'SignUp',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleSubmit (event) {
      this.$http({
        url: '/api/account/login/',
        method: 'post',
        data: {
          email: this.email,
          password: this.password
        }
      })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
    }
  }
}
</script>

<style scoped></style>
