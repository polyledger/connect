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
    <div class="row justify-content-center py-5">
      <coinbase-oauth-button/>
    </div>
  </div>
</template>

<script>
import CoinbaseOAuthButton from '@/components/CoinbaseOAuthButton'

export default {
  name: 'funding',
  components: {
    'coinbase-oauth-button': CoinbaseOAuthButton
  },
  data () {
    return {}
  }
}
</script>

<style scoped></style>
