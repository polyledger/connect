<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <ol class="breadcrumb">
        <div class="container">
          <li class="breadcrumb-item">1. Assess</li>
          <li class="breadcrumb-item text-muted">2. Verify</li>
          <li class="breadcrumb-item text-muted">3. Fund</li>
        </div>
      </ol>
    </div>
    <div class="row py-4">
      <div class="col text-center">
        <h3>Welcome to Polyledger!</h3>
        <h5>Please answer this set of questions to get started</h5>
        <hr>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="alert alert-danger" role="alert" v-if="errors.nonFieldErrors">
          <div class="row">
            <div class="col-1 d-flex align-items-center justify-content-center">
              <i class="icon icon-warning"></i>&nbsp;
            </div>
            <div class="col-11">
              <span v-for="error in errors.nonFieldErrors">{{error}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col mb-5">
        <form :class="{'was-validated': validated}" novalidate>
          <div class="form-group mt-4">
            <p class="lead"><strong>What is your current age?</strong></p>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question1"
                value="4"
                v-model="question1"
                required>
              <label class="form-check-label">Under 25</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question1"
                value="3"
                v-model="question1"
                required>
              <label class="form-check-label">25&ndash;35</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question1"
                value="2"
                v-model="question1"
                required>
              <label class="form-check-label">35&ndash;45</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question1"
                value="1"
                v-model="question1"
                required>
              <label class="form-check-label">Over 45</label>
            </div>
          </div>
          <hr>
          <div class="form-group">
            <p class="lead">
              <strong>When do you expect to start drawing from this investment?</strong>
            </p>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question2"
                value="4"
                v-model="question2"
                required>
              <label class="form-check-label">Not for another 5&ndash;10 years</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question2"
                value="3"
                v-model="question2"
                required>
              <label class="form-check-label">Not for another 2&ndash;5 years</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question2"
                value="2"
                v-model="question2"
                required>
              <label class="form-check-label">Within 2 years</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question2"
                value="1"
                v-model="question2"
                required>
              <label class="form-check-label">Immediately</label>
            </div>
          </div>
          <hr>
          <div class="form-group my-4">
            <p class="lead"><strong>What is your objective with this investment?</strong></p>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question3"
                value="4"
                v-model="question3"
                required>
              <label class="form-check-label">To grow aggressively</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question3"
                value="3"
                v-model="question3"
                required>
              <label class="form-check-label">To grow moderately</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question3"
                value="2"
                v-model="question3"
                required>
              <label class="form-check-label">To grow with caution</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question3"
                value="1"
                v-model="question3"
                required>
              <label class="form-check-label">To avoid losing money</label>
            </div>
          </div>
          <hr>
          <div class="form-group">
            <p class="lead">
              <strong>
                Which best describes your attitude for this investment for the next 3 months?
              </strong>
            </p>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question4"
                value="4"
                v-model="question4"
                required>
              <label class="form-check-label">Eh, in 3 months anything can happen</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question4"
                value="3"
                v-model="question4"
                required>
              <label class="form-check-label">I wouldn't worry about my losses</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question4"
                value="2"
                v-model="question4"
                required>
              <label class="form-check-label">I can only tolerate minor loss</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="question4"
                value="1"
                v-model="question4"
                required>
              <label class="form-check-label">I'd have a hard time accepting any losses</label>
            </div>
          </div>
          <div class="col-md-4 offset-4 py-5">
            <button class="btn btn-primary btn-lg btn-block" @click.prevent="handleSubmit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'questionnaire',
  data () {
    return {
      question1: 0,
      question2: 0,
      question3: 0,
      question4: 0,
      validated: false,
      portfolio: {},
      errors: {}
    }
  },
  mounted () {
    this.$http({
      url: '/api/users/current/',
      method: 'get',
      headers: {
        'Authorization': `Token ${localStorage.token}`
      }
    }).then((response) => {
      this.portfolio = response.data.portfolio
    }).catch((error) => {
      console.error(error)
      this.errors.push('Unable to get your profile information. Please try again later.')
    })
  },
  methods: {
    ...mapActions(['submit']),
    handleSubmit () {
      let score
      let sum = parseInt(this.question1) +
                parseInt(this.question2) +
                parseInt(this.question3) +
                parseInt(this.question4)

      if (sum === 0) {
        this.errors.nonFieldErrors = ['You must answer all of the questions.']
        this.validated = true
        return
      } else {
        this.nonFieldErrors = []
      }

      if (sum > 14) {
        score = 5
      } else if (sum > 12 && sum < 15) {
        score = 4
      } else if (sum > 9 && sum < 13) {
        score = 3
      } else if (sum > 6 && sum < 10) {
        score = 2
      } else if (sum < 7) {
        score = 1
      }

      this.portfolio.risk_score = score

      this.$store.dispatch('submit', this.portfolio).catch((error) => {
        this.errors = {}
        this.errors.nonFieldErrors = error.non_field_errors
      })

      this.validated = true
    }
  }
}
</script>

<style scoped>
label {
  color: #fff;
  font-size: 1rem;
}
</style>
