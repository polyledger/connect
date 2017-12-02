<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="../assets/img/logo.png" height="45" alt="">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/dashboard" tag="a" class="nav-link" active-class="active" v-if="isLoggedIn">
              <i class="icon icon-home"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/coins" tag="a" class="nav-link" active-class="active" v-if="isLoggedIn">
              <i class="icon icon-grid"></i> Coins
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/markets" tag="a" class="nav-link" active-class="active" v-if="isLoggedIn">
              <i class="icon icon-area-graph"></i> Markets
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tools" tag="a" class="nav-link" active-class="active" v-if="isLoggedIn">
              <i class="icon icon-tools"></i> Tools
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/settings" tag="a" class="nav-link" active-class="active" v-if="isLoggedIn">
              <i class="icon icon-cog"></i> Settings
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/signin" tag="a" class="nav-link" active-class="active" v-if="!isLoggedIn">
              Sign In
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" tag="a" class="nav-link" active-class="active" v-if="!isLoggedIn">
              Sign Up
            </router-link>
          </li>
          <li class="nav-item" @click.prevent="logout" v-if="isLoggedIn">
            <a role="button" href="" class="nav-link">Log out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'navbar',
  data () {
    return {}
  },
  methods: {
    ...mapActions(['logout'])
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style scoped>
.navbar-toggler {
  border: none;
}
.nav-item > .nav-link {
  font-weight: 600;
}
</style>
