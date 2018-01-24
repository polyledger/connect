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
        <div class="card my-4">
          <div class="card-body">
            <div class="row py-2">
              <div class="col-md-12">
                <h5 class="text-center">Historical Performance</h5>
                <ul class="nav nav-pills justify-content-center my-4">
                  <li class="nav-item">
                    <a class="nav-link active" role="button" href="" data-toggle="tab" @click.prevent="getChart('7D')">7D</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getChart('1M')">1M</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getChart('3M')">3M</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getChart('6M')">6M</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getChart('1Y')">1Y</a>
                  </li>
                </ul>
                <h6>Current Value: {{portfolio.value | currency}}</h6>
                <h5 class="mb-4">
                  <small class="badge badge-success">{{chart.change.dollar | currency}}</small>
                  <small class="badge badge-success">{{chart.change.percent | percent}}</small>
                </h5>
                <div class="chart-container">
                  <div class="d-flex align-items-center justify-content-center spinner" v-if="chart.loading">
                    <i class="fa fa-spinner fa-spin fa-3x"></i>
                  </div>
                  <canvas id="chart" height="270"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'view-portfolio',
  data () {
    return {
      portfolio: {},
      chart: {
        labels: [],
        dataset: [],
        change: {
          dollar: '0.00',
          percent: '0.00'
        },
        loading: true,
        period: '7D'
      },
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
          return
        }
        if (!this.portfolio.usd) {
          this.$router.push('/funding')
          return
        }

        if (this.portfolio.positions.length > 0) {
          this.getChart('7D', this.portfolio)
        } else {
          this.$router.push(`/portfolios/${this.portfolio.id}`)
        }
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to get your portfolio. Please try again later.')
      })
    },
    getChart (period) {
      this.chart.loading = true
      this.chart.period = period
      if (window.instance) { window.instance.destroy() }
      this.$http({
        url: `/api/portfolios/${this.portfolio.id}/chart/?period=${period}`,
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.chart.loading = false
        this.chart.dataset = response.data.dataset
        this.chart.labels = response.data.labels
        this.chart.change = response.data.change
        this.portfolio.value = response.data.value
        this.createChart()
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to render historical performance chart. Please try again later.')
      })
    },
    createChart () {
      let ctx = document.getElementById('chart').getContext('2d')
      window.instance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chart.labels,
          datasets: [
            {
              label: 'Portfolio',
              data: this.chart.dataset.portfolio,
              backgroundColor: ['rgba(98, 105, 142, 0.5)'],
              borderColor: ['rgba(98, 105, 142, 1)'],
              borderWidth: 1
            },
            {
              label: 'Bitcoin',
              data: this.chart.dataset.benchmark,
              backgroundColor: ['rgba(255, 227, 133, 0.5)'],
              borderColor: ['rgba(255, 227, 133, 1)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            labels: {
              fontColor: '#fff'
            }
          },
          tooltips: {
            enabled: true,
            mode: 'x',
            displayColors: true,
            callbacks: {
              labelColor: (tooltipItem, chart) => {
                let dataset = chart.config.data.datasets[tooltipItem.datasetIndex]
                return {
                  borderColor: dataset.borderColor[0],
                  backgroundColor: dataset.backgroundColor[0]
                }
              },
              label: (tooltipItem, data) => {
                return ' $' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7,
                fontColor: '#fff'
              }
            }],
            yAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                maxTicksLimit: 5,
                fontColor: '#fff',
                beginAtZero: false,
                callback: (value, index, values) => {
                  if (parseInt(value) >= 1000) {
                    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  } else {
                    return '$' + value
                  }
                }
              }
            }]
          }
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
.spinner {
  height: 270px;
}
i.fa-spinner {
  color: #fff;
}
.chart-container {
  position: relative;
  max-height: 270px;
}
.card-body {
  background-color: #252830;
}
.card {
  border-color: #5a617b;
}
</style>
