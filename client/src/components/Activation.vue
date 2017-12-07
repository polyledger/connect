<template>
  <div class="py-5 container">
    <h2>Account Activation</h2>
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="alert alert-danger" role="alert" v-if="error">
          <div class="row">
            <div class="col-1 d-flex align-items-center">
              <i class="icon icon-warning"></i>&nbsp;
            </div>
            <div class="col-11">
              <span v-html="error"></span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">
            <div v-if="!error">
              <div class="d-flex align-items-center justify-content-center py-5">
                <i class="fa fa-spinner fa-spin fa-3x"></i>
              </div>
              <p class="lead">Your account is being activated</p>
              <p>Please wait a moment while we activate your account.</p>
            </div>
            <div v-else>
              <p class="lead">Account activation failed</p>
              <p>Please contact support by
                <a href="https://polyledger.zendesk.com/hc/en-us/requests/new" target="blank">
                  opening a ticket
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      error: ''
    }
  },
  methods: {
    ...mapActions(['activate'])
  },
  mounted () {
    let token = this.$route.query.token
    this.$store.dispatch('activate', token).catch((error) => {
      this.error = error.toString()
    })
  }
}
</script>

<style scoped></style>
