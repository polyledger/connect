<template>
  <div class="page container">
    <h2>Create your account</h2>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <form>
              <div class="form-row">
                <div class="form-group col">
                  <input type="text" class="form-control" id="first_name" placeholder="First name">
                </div>
                <div class="form-group col">
                  <input type="text" class="form-control" placeholder="Last name">
                </div>
              </div>
              <div class="form-group">
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="password" placeholder="Password">
              </div>
              <div class="form-group">
                <div class="g-recaptcha" data-sitekey="6Ld61DoUAAAAAIaZHZoN_bHaYdHi3nB1Y3sJel9r"></div>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input" type="checkbox">
                    <small>I certify that I am 18 years of age or older, and I agree to the User Agreement and Privacy Policy.</small>
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Create Account</button>
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
    return {}
  }
}
</script>

<style scoped></style>
