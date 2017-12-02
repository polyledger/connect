<template>
  <div class="py-5 container">
    <h2>Getting Started</h2>
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <img class="card-img-top" src="../assets/img/dice_icon.png" alt="Dice icon">
          <div class="card-body">
            <h4 class="card-title">Complete Risk Assessment</h4>
            <p class="card-text">Please take our four-question risk assessment so we can understand your appetite for risk. We will develop an appropriate investment strategy for your portfolio.</p>
            <a role="button" class="btn btn-link btn-lg btn-block" disabled><span class="text-success">Complete <i class="icon icon-check"></i></span></a>
            <a href="/account/questions/" class="btn btn-dark btn-lg btn-block">Start Assessment</a>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <img class="card-img-top" src="../assets/img/coins_icon.png" alt="Coins icon">
          <div class="card-body">
            <h4 class="card-title">Choose Coins</h4>
            <p class="card-text">Choose which coins you would like in your portfolio. Having more coins in your portfolio increases management overhead but reduces portfolio risk significantly.</p>
            <a role="button" class="btn btn-link btn-lg btn-block" disabled><span class="text-success">Complete <i class="icon icon-check"></i></span></a>
            <button class="btn btn-dark btn-lg btn-block" disabled>Choose Coins</button>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <img class="card-img-top" src="../assets/img/piggybank_icon.png" alt="Piggybank icon">
          <div class="card-body">
            <h4 class="card-title">Fund Account (Premium)</h4>
            <p class="card-text">To get started with Polyledger's automated cryptocurrency investing, fund your account with BTC or ETH. This option is only available to users with premium accounts.</p>
            <a role="button" class="btn btn-link btn-lg btn-block" disabled><span class="text-success">Complete <i class="icon icon-check"></i></span></a>
            <button class="btn btn-dark btn-lg btn-block" disabled>Fund Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'getting-started',
  data () {
    return {}
  }
}
</script>

<style scoped>
.card, .card-title {
  color: #333;
}
</style>
