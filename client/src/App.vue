<template>
  <div id="app">
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style>
h2 {
  text-align: center;
  margin-bottom: 3.5rem;
}
.card {
  box-shadow: 0px 1px 46px -4px rgba(0,0,0,0.28);
  color: #333;
}
.form-check-label,
.custom-control-description {
  color: #333;
}
.account-extras {
  padding: 2.5rem;
  text-align: center;
}
</style>
