<template>
  <div class="py-5 container">
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
    <h2>Coins</h2>
    <p class="lead text-center">Select the coins you want to add to your portfolio (2 coins minimum).</p>
    <div class="row">
      <div class="col-md-2 pt-3" v-for="coin in coins">
        <div :class="['card', {'bg-success': coin.selected}]" @click="handleSelect(coin)" data-toggle="tooltip" data-placement="bottom" :title="coin.name">
          <div class="card-body text-center">
            <img :src="imagePath(coin)" :alt="coin.name" width="100">
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <button @click.prevent="handleSelectAll" class="btn btn-dark btn-lg mt-5 mx-1">Select All</button>
      <button @click.prevent="handleConfirm" class="btn btn-dark btn-lg mt-5 mx-1" :disabled="count < 2">Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'coins',
  data () {
    return {
      allSelected: false,
      count: 0,
      coins: [],
      errors: []
    }
  },
  methods: {
    imagePath (coin) {
      return require(`@/assets/img/coins/${coin.slug}.png`)
    },
    handleSelect (coin) {
      this.count += coin.selected ? -1 : 1
      coin.selected = !coin.selected
    },
    handleSelectAll () {
      this.count = this.allSelected ? 0 : this.coins.length
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
    this.$http({
      url: '/api/coins/',
      method: 'get',
      headers: {
        'Authorization': `Token ${localStorage.token}`
      }
    }).then((response) => {
      this.coins = response.data.map(coin => {
        coin.selected = false
        return coin
      })
    }).catch((error) => {
      console.error(error)
      this.errors.push('Unable to retrieve coins from the server. Please try again later.')
    })
  }
}
</script>

<style scoped>
.card:hover {
  cursor: pointer;
  background-color: #ddd;
}
</style>
