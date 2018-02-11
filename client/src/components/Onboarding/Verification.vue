<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <ol class="breadcrumb">
        <div class="container">
          <li class="breadcrumb-item text-muted">1. Assess</li>
          <li class="breadcrumb-item">2. Verify</li>
        </div>
      </ol>
    </div>
    <div class="row py-4">
      <div class="col text-center">
        <h3>Verify your risk level</h3>
        <h5>Based on your response, we feel this risk level would be appropriate.</h5>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <form>
          <div class="form-group col-6 offset-3">
            <div class="form-group">
              <label for="risk_score">Risk Score: {{portfolio.risk_score}}/5</label>
              <vue-slider ref="slider" name="risk_score" :value="portfolio.risk_score" :min="1" :max="5" :tooltip="false" required></vue-slider>
            </div>
            <p>A score of 1 indicates the lowest risk and a score of 5 indicates the highest risk.</p>
          </div>
          <div class="col-md-4 offset-4 py-5">
            <button class="btn btn-primary btn-lg btn-block" @click.prevent="verify(portfolio)">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vueSlider from 'vue-slider-component'

export default {
  name: 'verification',
  components: {
    vueSlider
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions(['verify'])
  },
  computed: {
    ...mapGetters(['portfolio'])
  }
}
</script>

<style scoped></style>
