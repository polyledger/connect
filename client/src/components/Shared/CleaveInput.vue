<template>
  <input type="text" @keyup="updateValue">
</template>

<script>
import Cleave from 'cleave.js'

export default {
  name: 'cleave-input',
  props: {
    value: {
      type: [String, Number],
      required: false
    },
    options: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.cleave = new Cleave(this.$el, this.options)
    this.cleave.setRawValue(this.value)
  },
  destroyed () {
    this.cleave.destroy()
  },
  watch: {
    value: 'updateInput'
  },
  methods: {
    updateValue () {
      let value = this.cleave.getRawValue()
      if (value !== this.value) {
        this.$emit('input', value)
      }
    },
    updateInput () {
      this.cleave.setRawValue(this.value)
    }
  }
}
</script>

<style scoped></style>
