<template>
  <div class="py-5 container">
    <h2>Coins</h2>
    <p class="lead text-center">Select the coins you want to add to your portfolio (2 coins minimum).</p>
    <div class="row">
      <div class="col-md-2 pt-3" v-for="coin in coins">
        <div :class="['card', {'bg-success': coin.selected}]" @click="handleSelect(coin)" data-toggle="tooltip" data-placement="bottom" :title="coin">
          <div class="card-body text-center">
            <img :src="imagePath(coin.name)" alt="Bitcoin" width="100">
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <button @click.prevent="handleSelectAll" class="btn btn-dark btn-lg mt-5 mx-1">Select All</button>
      <button @click.prevent="handleConfirm" class="btn btn-dark btn-lg mt-5 mx-1">Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'coins',
  data () {
    return {
      allSelected: false,
      coins: [
        { name: 'bitcoin', selected: false },
        { name: 'bitcoin_cash', selected: false },
        { name: 'ethereum', selected: false },
        { name: 'litecoin', selected: false },
        { name: 'ethereum_classic', selected: false },
        { name: 'ripple', selected: false },
        { name: 'neo', selected: false },
        { name: 'zcash', selected: false },
        { name: 'monero', selected: false },
        { name: 'dash', selected: false }
      ]
    }
  },
  methods: {
    imagePath (coin) {
      return require(`@/assets/img/coins/${coin}.png`)
    },
    handleSelect (coin) {
      coin.selected = !coin.selected
    },
    handleSelectAll () {
      this.coins.forEach(coin => {
        coin.selected = !this.allSelected
      })
      this.allSelected = !this.allSelected
    },
    handleConfirm () {
      // TODO: POST coins to user
    }
  },
  mounted () {
    // TODO: Request `coins` endpoint
  }
}
</script>

<style scoped>
.card:hover {
  cursor: pointer;
  background-color: #ddd;
}
</style>
