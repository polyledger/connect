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
              <a role="button" class="btn btn-success" @click="checkout" v-if="!portfolio.purchased"><i class="icon icon-eye"></i> Reveal</a>
              <router-link :to="`/portfolios/${portfolio.id}`" tag="a" role="button" class="btn btn-primary"><i class="icon icon-pencil"></i> Edit</router-link>
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
        <div v-if="getTaskResult.status === 'PROGRESS'">
          <p class="lead text-center">{{getTaskResult.message}}</p>
          <div class="progress position-relative">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="`width: ${getTaskResult.percent}%`" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
              <small class="justify-content-center d-flex position-absolute w-100">{{getTaskResult.percent}}% complete</small>
          </div>
          <p class="text-center py-2">Your portfolio allocation is in progress. Please wait while we finish crunching numbers.</p>
        </div>
        <div class="table-responsive" v-else>
          <table class="table">
            <tbody>
              <tr>
                <th scope="row">Coins</th>
                <td class="text-center" data-toggle="tooltip" data-placement="top" v-for="position in portfolio.positions" :title="position.coin.name">
                  <img :src="imagePath(position.coin.symbol)" width="25">
                </td>
              </tr>
              <tr v-if="portfolio.purchased">
                <th scope="row">Percent</th>
                <td class="text-center" v-for="position in portfolio.positions">{{position.amount | percent}}</td>
              </tr>
              <tr v-if="portfolio.purchased">
                <th scope="row">Amount</th>
                <td class="text-center" v-for="position in portfolio.positions">{{((position.amount/100)*portfolio.usd) | currency}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <chart :portfolio="portfolio" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Portfolio/Chart'
import numeral from 'numeral'
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['getTaskResult'])
  },
  methods: {
    ...mapActions(['pollTaskResult']),
    imagePath (coin) {
      return require(`@/assets/img/coins/${coin}.png`)
    },
    getPortfolio () {
      return this.$http({
        url: '/api/users/current/',
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        return response.data.portfolio
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to get your portfolio. Please try again later.')
      })
    },
    checkout () {
      let that = this
      this.$checkout.open({
        name: 'Polyledger',
        currency: 'USD',
        amount: 1999,
        token (token) {
          that.$http({
            url: '/api/users/current/charge/',
            method: 'post',
            data: token,
            headers: {
              'Authorization': `Token ${localStorage.token}`
            }
          }).then((response) => {
            that.portfolio = response.data.portfolio
          }).catch((error) => {
            console.error(error)
            that.errors.push('Unable to get your portfolio. Please contact support at support@polyledger.com.')
          })
        }
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
    let taskResult = store.getters.getTaskResult

    if (taskResult.status) {
      let interval = setInterval(async () => {
        let task = await this.pollTaskResult()

        if (task.status === 'SUCCESS') {
          clearInterval(interval)
          this.portfolio = await this.getPortfolio()
        }
      }, 1000)
    } else {
      this.portfolio = await this.getPortfolio()

      if (!this.portfolio.risk_score) {
        this.$router.push('/questionnaire')
      }
    }
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
