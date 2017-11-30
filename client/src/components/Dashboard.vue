<template>
  <div class="container">
    <div class="row py-3">
      <div class="col-md-12">
        <div class="dashhead">
          <div class="dashhead-titles">
            <h6 class="dashhead-subtitle">Portfolio</h6>
            <h3 class="dashhead-title">Overview</h3>
          </div>
          <div class="dashhead-toolbar">
            <div class="dashhead-toolbar-item d-flex">
              <span class="align-self-center lead">Risk Score: </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <h5>Your Portfolio</h5>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="row">Coins</th>
                <!-- <th scope="row" class="text-center" data-toggle="tooltip" data-placement="top" v-for="coin in portfolio" title="{{coin.name}}"> -->
                  <!-- <img :src="'../assets/img/' + {{coin.name}} + '.png'" width="25"> -->
                <!-- </th> -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Percent</th>
                <!-- <td class="text-center" v-for="coin in portfolio">{{coin.percent}}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row py-2">
      <div class="col-md-12">
        <h5 class="text-center">Historical Performance</h5>
        <ul class="nav nav-pills justify-content-center my-4">
          <li class="nav-item">
            <a class="nav-link active" role="button" tabindex="0">7D</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" role="button" tabindex="0">1M</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" role="button" tabindex="0">3M</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" role="button" tabindex="0">6M</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" role="button" tabindex="0">1Y</a>
          </li>
        </ul>
        <h2 class="statcard-number text-center">
          <small class="badge">
            <!-- {{percentChange}} -->
          </small>
        </h2>
        <div class="text-center my-5">
          <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>
        <canvas id="portfolio-value-chart" class="my-5" height="270"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {}
  },
  mounted () {
    this.$http({
      url: '/api/users/',
      method: 'get'
    }).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
.navbar-dark .navbar-toggler {
  border-color: none !important;
}
.dashhead-toolbar-item {
  height: 34px;
}
</style>
