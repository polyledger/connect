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
    <div class="row justify-content-center py-5" v-if="!accounts.length">
      <coinbase-oauth-button :clientId="clientId" :redirectUri="redirectUri"/>
    </div>
    <div class="row" v-if="accounts.length">
      <div class="col-4 offset-4">
        <form>
          <div v-for="account in accounts">
            <div class="form-group">
              Name: {{account.name}}
            </div>
            <div class="form-group">
              Currency: {{account.currency.name}}
            </div>
            <div class="form-group">
              Balance: {{account.balance.amount}} {{account.balance.currency}}
            </div>
            <div class="form-group">
              <label for="investment">Investment</label>
              <div class="input-group mb-2 mb-sm-0">
                <cleave-input class="form-control" name="investment" v-model="investment" :options="{numeral: true, numeralPositiveOnly: true, numeralDecimalScale: 8}" required></cleave-input>
                <div class="input-group-addon">{{account.balance.currency}}</div>
              </div>
            </div>
          </div>
          <button class="btn btn-block btn-primary" @click.prevent="onSubmit">Submit</button>
        </form>
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
      accounts: [],
      accessToken: '',
      clientId: '7af1f354fd24387efb4eeedab0e712695b56379a520ff617c75de30978263ad1',
      investment: '',
      redirectUri: 'http://localhost:8080/funding'
    }
  },
  methods: {
    onSubmit () {
      console.log('Transferring ' + this.investment + ' coins to Binance')
      this.$http({
        url: 'https://api.coinbase.com/v2/accounts/' + this.accounts[0].id + '/transactions',
        method: 'post',
        data: {
          type: 'transfer',
          to: '0xd437d872ed6737fa2159655980046e57a58e89b3',
          amount: this.investment
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
    }
  },
  mounted () {
    let query = this.$route.query
    if (query.hasOwnProperty('code')) {
      let userId = '1'
      this.$http({
        url: `/api/users/${userId}/coinbase_oauth/`,
        method: 'post',
        data: {
          code: query.code
        },
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then(response => {
        this.accessToken = response.data.access_token

        this.$http({
          url: 'https://api.coinbase.com/v2/accounts',
          method: 'get',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'CB-VERSION': '2018-01-25'
          }
        }).then(response => {
          this.accounts = response.data.data
        }).catch(error => {
          // TODO: Create error alert
          console.log(error.response)
        })
      }).catch(error => {
        // TODO: Create error alert
        console.error(error.response.data.error_description)
      })
    }
  }
}
</script>

<style scoped></style>
