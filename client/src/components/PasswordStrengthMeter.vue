<template>
  <div class="strength-meter">
    <div class="strength-meter-fill" :data-score="passwordStrength"></div>
  </div>
</template>

<script>
import zxcvbn from 'zxcvbn'

export default {
  name: 'password-strength-meter',
  props: {
    password: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * passwordStrength is the score calculated by zxcvbn
     * @return {Number} Password Strength Score
     */
    passwordStrength () {
      return this.password ? zxcvbn(this.password).score : null
    },
    /**
     * passwordCount holds the character count of the
     * current password. It shows the count up to the `secureLength`.
     * @return {Number} Password Character Count
     */
    passwordCount () {
      return this.password && (this.password.length > this.secureLength ? `${this.secureLength}+` : this.password.length)
    }
  }
}
</script>

<style>
.strength-meter {
  position: relative;
  height: 3px;
  background: #DDD;
  margin: 10px auto 20px;
  border-radius: 3px;
}
.strength-meter:before, .strength-meter:after {
  content: '';
  height: inherit;
  background: transparent;
  display: block;
  border-color: #FFF;
  border-style: solid;
  border-width: 0 5px 0 5px;
  position: absolute;
  width: 44%;
  z-index: 10;
}
.strength-meter:before {
  left: 17.5%;
}
.strength-meter:after {
  right: 17.5%;
}
.strength-meter-fill {
  background: transparent;
  height: inherit;
  position: absolute;
  width: 0;
  border-radius: inherit;
  transition: width 0.5s ease-in-out, background 0.25s;
}
.strength-meter-fill[data-score='0'] {
  background: #c0392b;
  width: 20%;
}
.strength-meter-fill[data-score='1'] {
  background: #e67e22;
  width: 40%;
}
.strength-meter-fill[data-score='2'] {
  background: #f1c40f;
  width: 60%;
}
.strength-meter-fill[data-score='3'] {
  background: #87D37C;
  width: 80%;
}
.strength-meter-fill[data-score='4'] {
  background: #26A65B;
  width: 100%;
}
</style>
