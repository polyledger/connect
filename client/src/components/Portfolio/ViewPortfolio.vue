<template>
  <div class="container">
    <div class="row py-4">
      <div class="col-md-12">
        <div class="alert alert-danger alert-dismissable fade show" role="alert" v-for="error in errors">
          <div class="row">
            <div class="col-1 d-flex align-items-center justify-content-center">
              <i class="icon icon-warning"></i>&nbsp;
            </div>
            <div class="col-10">
              <span>{{error}}</span>
            </div>
            <div class="col-1 d-flex align-items-center justify-content-end">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </div>
        <div class="dashhead">
          <div class="dashhead-titles">
            <h6 class="dashhead-subtitle">Portfolio</h6>
            <h3 class="dashhead-title">Home</h3>
          </div>
          <div class="dashhead-toolbar">
            <div class="dashhead-toolbar-item">
              <router-link :to="`/portfolios/${portfolio.id}`" tag="a" role="button" class="btn btn-dark"><i class="icon icon-pencil"></i> Edit</router-link>
            </div>
            <span class="dashhead-toolbar-divider hidden-xs"></span>
            <div class="dashhead-toolbar-item">
              <h5>Risk: {{portfolio.risk_score}}/5</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <h5>{{portfolio.title}}</h5>
        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <th scope="row">Coins</th>
                <td class="text-center" data-toggle="tooltip" data-placement="top" v-for="position in portfolio.positions" :title="position.coin.name">
                  <img :src="imagePath(position.coin.symbol)" width="25">
                </td>
              </tr>
              <tr>
                <th scope="row">Percent</th>
                <td class="text-center" v-for="position in portfolio.positions">{{position.amount | percent}}</td>
              </tr>
              <tr>
                <th scope="row">Amount</th>
                <td class="text-center" v-for="position in portfolio.positions">{{((position.amount/100)*portfolio.value) | currency}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <chart :portfolio="this.portfolio" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Portfolio/Chart'
import numeral from 'numeral'

export default {
  name: 'view-portfolio',
  components: {
    'chart': Chart
  },
  data () {
    return {
      portfolio: {},
      errors: []
    }
  },
  methods: {
    imagePath (coin) {
      return require(`@/assets/img/coins/${coin}.png`)
    },
    getPortfolio () {
      this.$http({
        url: '/api/users/current/',
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.portfolio = response.data.portfolio

        if (!this.portfolio.risk_score) {
          this.$router.push('/questionnaire')
        }
        if (!this.portfolio.usd) {
          this.$router.push('/funding')
        }
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to get your portfolio. Please try again later.')
      })
    }
  },
  filters: {
    currency (value) {
      return numeral(value).format('$0,0.00')
    },
    percent (value) {
      return numeral(Number(value / 100)).format('0,0.00%')
    }
  },
  async mounted () {
    this.getPortfolio()
  },
  async updated () {
    await this.$nextTick
    window.$('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style scoped>
.dashhead-toolbar-item > a[role="button"] {
  cursor: pointer;
}
.dashhead-toolbar-item > h5 {
  line-height: 1.8;
}
</style>
