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
    <div class="row py-5 justify-content-center">
      <ul class="nav nav-bordered">
        <li class="nav-item">
          <img :src="require('@/assets/img/coins/BTC.png')" width="15">
          <a class="nav-item nav-link active" href="#bitcoin" data-toggle="tab" role="tab"
             @click="type = 'bitcoin'">
            Bitcoin
          </a>
        </li>
        <li class="nav-item">
          <img :src="require('@/assets/img/coins/ETH.png')" width="15">
          <a class="nav-item nav-link" href="#ethereum" data-toggle="tab" role="tab"
             @click="type = 'ethereum'">
            Ethereum
          </a>
        </li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="tab-content">
          <div class="tab-pane show active" :id="type" role="tabpanel">
            <div class="row justify-content-center">
              <div class="col-md-6">
                <form class="was-validated" novalidate>
                  <div class="form-group">
                    <label>Your {{type | capitalize}} address:</label>
                    <div class="input-group">
                      <input class="form-control" :pattern="pattern" v-model="client.address" required>
                      <span class="input-group-btn">
                        <button class="btn btn-secondary" type="button" @click="submit">
                          Submit
                        </button>
                      </span>
                    </div>
                    <hr>
                    <p>We need your {{type | capitalize}} address so we can verify your investment. Please send your funds from this address.</p>
                    <div class="invalid-feedback">
                      <span>Invalid feedback</span>
                    </div>
                  </div>

                  <br><br>

                  <div class="form-group">
                    <label>Send your funds to this address:</label>
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        :name="type"
                        :value="address"
                        readonly>
                      <span class="input-group-btn">
                        <button
                          class="btn btn-secondary"
                          type="button"
                          @click="copyTextToClipboard(type)">
                          <i class="icon icon-copy"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </form>
                <hr>
                <p>We'll send you an email notification as soon as your funds are received.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'funding',
  data () {
    return {
      type: 'bitcoin',
      client: {
        address: ''
      },
      bitcoin: {
        address: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
        pattern: '.{25,34}'
      },
      ethereum: {
        address: '0x201C6c7E32FaD71D2e8c554958A2283a62a67a48',
        pattern: '.{42}'
      }
    }
  },
  computed: {
    address () {
      return this[this.type].address
    },
    pattern () {
      return this[this.type].pattern
    }
  },
  filters: {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  methods: {
    copyTextToClipboard (name) {
      document.querySelector(`input[name=${name}]`).select()
      document.execCommand('copy')
    },
    submit () {
      console.log(this.client.address)
    }
  }
}
</script>

<style scoped>
input[readonly] {
  color: #fff;
}
.input-group button {
  border: 1px solid #fff;
}
</style>
