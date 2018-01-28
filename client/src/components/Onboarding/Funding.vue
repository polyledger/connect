<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <ol class="breadcrumb">
        <div class="container">
          <li class="breadcrumb-item text-muted">1. Assess</li>
          <li class="breadcrumb-item text-muted">2. Verify</li>
          <li class="breadcrumb-item">3. Fund</li>
        </div>
      </ol>
    </div>
    <div class="row py-5">
      <div class="col-6 offset-3 text-center">
        <h3>Fund your portfolio with Coinbase</h3>
        <hr>
      </div>
    </div>
    <div class="row justify-content-center py-5" v-if="Object.keys(account).length === 0">
      <coinbase-oauth-button
        :clientId="clientId"
        :redirectUri="redirectUri"
        :sendLimitAmount="sendLimitAmount"
        :sendLimitCurrency="sendLimitCurrency"
        :sendLimitPeriod="sendLimitPeriod"/>
    </div>
    <div class="row" v-if="Object.keys(this.account).length !== 0">
      <div class="col-4 offset-4">
        <div class="card">
          <div class="card-body">
            <form>
              <h4 class="text-center">{{account.name}}</h4>
              <h6 class="text-center">{{account.balance.amount}} {{account.balance.currency}}</h6>
              <div class="form-group">
                <label for="investment">Investment</label>
                <div class="input-group mb-2 mb-sm-0">
                  <cleave-input class="form-control" name="investment" v-model="investment" :options="{numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 8}" required></cleave-input>
                  <div class="input-group-addon">{{account.balance.currency}}</div>
                </div>
                <small class="form-text text-muted">
                  The initial investment for your digital asset portfolio. Estimated USD value: ${{investment * price}}
                </small>
              </div>
              <button class="btn btn-block btn-primary" @click.prevent="onSend">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// See Coinbase Connect documentation for reference
// https://developers.coinbase.com/docs/wallet/coinbase-connect/integrating

import CoinbaseOAuthButton from '@/components/Shared/CoinbaseOAuthButton'
import CleaveInput from '@/components/Shared/CleaveInput'

export default {
  name: 'funding',
  components: {
    'coinbase-oauth-button': CoinbaseOAuthButton,
    CleaveInput
  },
  data () {
    return {
      account: {},
      accessToken: '',
      clientId: '7af1f354fd24387efb4eeedab0e712695b56379a520ff617c75de30978263ad1',
      investment: 0,
      redirectUri: 'http://localhost:8080/funding',
      sendLimitAmount: '1',
      sendLimitCurrency: 'USD',
      sendLimitPeriod: 'day',
      price: 0
    }
  },
  methods: {
    onSend () {
      this.$http({
        url: 'https://api.coinbase.com/v2/accounts/' + this.account.id + '/transactions',
        method: 'post',
        data: {
          type: 'send',
          to: 'BTC_OR_ETH_ADDRESS_FROM_COINBASE_OAUTH_STEP',
          amount: this.investment,
          currency: this.account.balance.currency
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'CB-VERSION': '2018-01-25'
        }
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error.response)
      })
    },
    getPrice (currency) {
      return this.$http({
        url: `https://api.coinbase.com/v2/prices/${this.account.balance.currency}-USD/spot`,
        method: 'get',
        headers: {
          'CB-VERSION': '2018-01-25'
        }
      }).then(response => {
        console.log(response)
        return response.data.data.amount
      }).catch(error => {
        console.error(error.response)
      })
    },
    hasUrlCodeParam () {
      return this.$route.query.hasOwnProperty('code')
    },
    getAccessToken () {
      let userId = '1'
      return this.$http({
        url: `/api/users/${userId}/coinbase_oauth/`,
        method: 'post',
        data: {
          code: this.$route.query.code
        },
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then(response => {
        return response.data.access_token
      }).catch(error => {
        // TODO: Create error alert
        console.error(error.response.data.error_description)
      })
    },
    getAccount () {
      return this.$http({
        url: 'https://api.coinbase.com/v2/accounts',
        method: 'get',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'CB-VERSION': '2018-01-25'
        }
      }).then(response => {
        return response.data.data[0]
      }).catch(error => {
        // TODO: Create error alert
        console.log(error.response)
      })
    }
  },
  async mounted () {
    if (this.hasUrlCodeParam()) {
      this.accessToken = await this.getAccessToken()
      this.account = await this.getAccount()
      this.price = await this.getPrice()
    }
  }
}
</script>

<style scoped>
h4, h6 {
  color: #333;
}
</style>
