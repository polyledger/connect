<template>
  <a class="btn btn-lg" :href="href">
    <span>c</span> Sign in with Coinbase
  </a>
</template>

<script>
// See Coinbase Connect documentation for reference
// https://developers.coinbase.com/docs/wallet/coinbase-connect/integrating

export default {
  name: 'coinbase-oauth-button',
  props: {
    clientId: String,
    redirectUri: String,
    sendLimitAmount: String,
    sendLimitCurrency: String,
    sendLimitPeriod: String
  },
  computed: {
    href () {
      let href = 'https://www.coinbase.com/oauth/authorize'
      href += '?response_type=code'
      href += `&client_id=${this.clientId}`
      href += `&redirect_uri=${this.redirectUri}`
      href += `&scope=wallet:accounts:read,wallet:transactions:send`
      href += '&account_currency=BTC,ETH'
      href += `&meta[send_limit_amount]=${this.sendLimitAmount}`
      href += `&meta[send_limit_currency]=${this.sendLimitCurrency}`
      href += `&meta[send_limit_period]=${this.sendLimitPeriod}`
      return href
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Maven+Pro:500');

a {
  position: relative;
  padding-left: 44px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 61px;
  color: #fff;
  background-color: #1087dd;
  border-color: rgba(0,0,0,0.2);
  max-width: 275px;
}
a > span {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 32px;
  line-height: 34px;
  font-size: 1.6em;
  text-align: center;
  border-right: 1px solid rgba(0,0,0,0.2);
  line-height: 40px;
  width: 45px;
  font-size: 1.8em;
  font-family: 'Maven Pro', sans-serif;
}
a:focus {
  color: #fff;
  background-color: #0d6aad;
  border-color: rgba(0,0,0,0.2)
}
a:hover {
  color: #fff;
  background-color: #0d6aad;
  border-color: rgba(0,0,0,0.2)
}
a:active {
  color: #fff;
  background-color: #0d6aad;
  border-color: rgba(0,0,0,0.2)
}
a:active:hover,
a:active:focus {
  color: #fff;
  background-color: #0a568c;
  border-color: rgba(0,0,0,0.2)
}
a:active {
  background-image: none;
}
</style>
