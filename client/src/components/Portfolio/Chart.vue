<template>
  <div class="card my-4">
    <div class="card-body">
      <div class="row py-2">
        <div class="col-md-12">
          <ul class="nav nav-pills justify-content-center my-4">
            <li class="nav-item">
              <a class="nav-link active" role="button" href="" data-toggle="tab" @click.prevent="getData('7D')">7D</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getData('1M')">1M</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getData('3M')">3M</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getData('6M')">6M</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" role="button" href="" data-toggle="tab" @click.prevent="getData('1Y')">1Y</a>
            </li>
          </ul>
          <div id="chart">
            <div class="d-flex align-items-center justify-content-center spinner" v-if="loading">
              <i class="fa fa-spinner fa-spin fa-3x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import numeral from 'numeral'

export default {
  name: 'chart',
  props: {
    portfolio: Object
  },
  data () {
    return {
      labels: [],
      series: [],
      change: {
        dollar: '0.00',
        percent: '0.00'
      },
      loading: true,
      period: '7D',
      errors: []
    }
  },
  methods: {
    getData (period) {
      this.period = period

      this.$http({
        url: `/api/portfolios/${this.portfolio.id}/chart/?period=${period}`,
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.loading = false
        this.series = response.data.series
        this.labels = response.data.labels
        this.change = response.data.change
        this.portfolio.value = response.data.value
        this.createChart()
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to render historical performance chart. Please try again later.')
      })
    },
    createChart () {
      Highcharts.chart('chart', {
        chart: {
          type: 'line',
          backgroundColor: 'rgba(255, 255, 255, 0.0)'
        },
        colors: ['#b4c4fd', '#ead36b'],
        credits: {
          enabled: false
        },
        legend: {
          itemStyle: {
            color: '#fff'
          },
          itemHoverStyle: {
            color: '#eee'
          }
        },
        series: this.series,
        subtitle: {
          text: `
            ${numeral(this.portfolio.value).format('$0,0.00')}<br>
            <span class="badge badge-success">${numeral(this.change.dollar).format('$0,0.00')}</span>
            <span class="badge badge-success">${numeral(Number(this.change.percent / 100)).format('0,0.00%')}</span>
          `,
          style: {
            color: '#fff',
            textAlign: 'center',
            fontSize: '1rem',
            lineHeight: '1.5rem'
          },
          useHTML: true
        },
        title: {
          text: 'Portfolio Value',
          style: {
            color: '#fff'
          }
        },
        tooltip: {
          formatter () {
            let date = Highcharts.dateFormat('%e. %b %Y', new Date(this.x))
            let result = `<strong>${date}</strong><br>`
            this.points.forEach((value) => {
              result += '<span style="color:' + value.series.color + '">\u25CF</span> '
              result += value.series.name + ': '
              result += numeral(value.y).format('$0,0')
              result += '<br>'
            })
            return result
          },
          shared: true
        },
        xAxis: {
          labels: {
            style: {
              color: '#fff'
            }
          },
          type: 'datetime'
        },
        yAxis: {
          gridLineWidth: 0,
          labels: {
            formatter () {
              return numeral(this.value).format('$0,0')
            },
            style: {
              color: '#fff'
            }
          },
          minorGridLineWidth: 0,
          title: {
            text: 'Value (USD)',
            style: {
              color: '#fff'
            }
          }
        }
      })
    }
  },
  watch: {
    portfolio () {
      this.getData('7D')
    }
  }
}
</script>

<style scoped>
.spinner {
  height: 270px;
}
i.fa-spinner {
  color: #fff;
}
.card-body {
  background-color: #252830;
}
.card {
  border-color: #5a617b;
}
</style>
