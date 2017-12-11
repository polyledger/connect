<template>
  <div class="container">
    <div class="row py-4">
      <div class="col-md-12">
        <div class="alert alert-danger alert-dismissable fade show" role="alert" v-for="error in errors.serverErrors">
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
            <h3 class="dashhead-title">Edit</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card my-4">
          <div class="card-body">
            <div class="row py-2">
              <div class="col-md-4 offset-md-4">
                <h5 class="text-center">Details</h5>
                <div class="alert alert-danger" role="alert" v-if="errors.nonFieldErrors">
                  <div class="row">
                    <div class="col-1 d-flex align-items-center">
                      <i class="icon icon-warning"></i>&nbsp;
                    </div>
                    <div class="col-11">
                      <span v-for="error in errors.nonFieldErrors">{{error}}</span>
                    </div>
                  </div>
                </div>
                <form :class="{'was-validated': validated}" novalidate>
                  <div class="form-group">
                    <label for="title">Title</label>
                    <input class="form-control" placeholder="My Portfolio" name="title" type="text" v-model="portfolio.title" required>
                    <div class="invalid-feedback" v-if="errors.title">
                      <span v-for="error in errors.title">
                        {{error}}
                      </span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="investment">Investment</label>
                    <div class="input-group mb-2 mb-sm-0">
                      <div class="input-group-addon">$</div>
                      <cleave-input class="form-control" name="investment" v-model="portfolio.usd" :options="{numeral: true, numeralPositiveOnly: true}" required></cleave-input>
                    </div>
                    <div class="invalid-feedback" v-if="errors.usd">
                      <span v-for="error in errors.usd">
                        {{error}}
                      </span>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-group">
                      <label for="risk_score">Risk Score</label>
                      <input class="form-control" name="risk_score" type="number" min="1" max="5" v-model.number="portfolio.risk_score" required>
                      <div class="invalid-feedback" v-if="errors.risk_score">
                        <span v-for="error in errors.risk_score">
                          {{error}}
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="row pt-5">
              <div class="col-md-12">
                <h5 class="text-center">Coins</h5>
                <p class="lead text-center">Select the coins you want to add to your portfolio (2 coins minimum).</p>
                <div class="row">
                  <div class="col-md-2 pt-3" v-for="coin in coins">
                    <div :class="['card', 'coin-card', {'bg-success': coin.selected}]" @click="handleSelect(coin)" data-toggle="tooltip" data-placement="top" :title="coin.name">
                      <div class="card-body text-center">
                        <img :src="imagePath(coin)" :alt="coin.name" width="100">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <button @click.prevent="handleSelectAll" class="btn btn-dark btn-lg mt-5 mx-1">{{buttonValue}}</button>
                  <button @click.prevent="updatePortfolio" class="btn btn-dark btn-lg mt-5 mx-1" :disabled="selectedCount < 2">Confirm</button>
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
import CleaveInput from '@/components/CleaveInput'

export default {
  name: 'edit-portfolio',
  components: {
    CleaveInput
  },
  data () {
    return {
      portfolio: {},
      allSelected: false,
      selectedCount: 0,
      buttonValue: 'Select All',
      coins: [],
      validated: false,
      errors: {
        serverErrors: []
      }
    }
  },
  methods: {
    imagePath (coin) {
      return require(`@/assets/img/coins/${coin.slug}.png`)
    },
    getPortfolio () {
      this.$http({
        url: `/api/portfolios/${this.$route.params.id}/`,
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.portfolio = response.data
        this.getCoins()
      }).catch((error) => {
        console.error(error)
        this.errors.push('Unable to get your portfolio. Please try again later.')
      })
    },
    getCoins () {
      this.$http({
        url: '/api/coins/',
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.coins = response.data.map(coin => {
          if (this.portfolio.coins.includes(coin.symbol)) {
            coin.selected = true
            this.selectedCount++
          } else {
            coin.selected = false
          }
          return coin
        })
        if (this.selectedCount === this.coins.length) {
          this.allSelected = true
          this.buttonValue = 'Deselect All'
        }
      }).catch((error) => {
        console.error(error)
        this.errors.serverErrors.push('Unable to retrieve coins from the server. Please try again later.')
      })
    },
    updatePortfolio () {
      this.$http({
        url: `/api/portfolios/${this.$route.params.id}/`,
        method: 'PUT',
        data: this.portfolio,
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        this.$router.push('/portfolio')
      }).catch((error) => {
        console.error(error)
        this.errors = {
          serverErrors: []
        }
        this.errors.risk_score = error.response.data.risk_score
        this.errors.title = error.response.data.title
        this.errors.usd = error.response.data.usd
        this.errors.nonFieldErrors = error.response.data.non_field_errors
        this.validated = true
      })
    },
    handleSelect (coin) {
      coin.selected = !coin.selected
      if (coin.selected) {
        this.selectedCount++
        this.portfolio.coins.push(coin.symbol)
        if (this.selectedCount === this.coins.length) {
          this.allSelected = true
          this.buttonValue = 'Deselect All'
        }
      } else {
        this.selectedCount--
        let index = this.portfolio.coins.indexOf(coin.symbol)
        this.portfolio.coins.splice(index, 1)
        this.buttonValue = 'Select All'
        this.allSelected = false
      }
    },
    handleSelectAll () {
      this.allSelected = !this.allSelected
      if (this.allSelected) {
        this.selectedCount = this.coins.length
        this.coins.forEach(coin => {
          coin.selected = true
          this.portfolio.coins.push(coin.symbol)
        })
        this.buttonValue = 'Deselect All'
      } else {
        this.selectedCount = 0
        this.coins.forEach(coin => {
          coin.selected = false
          let index = this.portfolio.coins.indexOf(coin.symbol)
          this.portfolio.coins.splice(index, 1)
        })
        this.buttonValue = 'Select All'
      }
    }
  },
  mounted () {
    this.getPortfolio()
  },
  updated () {
    window.$('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style scoped>
.card {
  border-color: #5a617b;
  color: #fff;
}
.card.coin-card:hover {
  cursor: pointer;
}
.card-body {
  background-color: #252830;
}
.bg-success > .card-body {
  background-color: #1BC98E;
}
</style>
