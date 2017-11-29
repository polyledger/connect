<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="../assets/logo.png" height="45" alt="">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <router-link to="/signin" tag="li" class="nav-item" active-class="active">
            <a class="nav-link">Sign In</a>
          </router-link>
          <router-link to="/signup" tag="li" class="nav-item" active-class="active">
            <a class="nav-link">Sign Up</a>
          </router-link>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {}
  }
}
</script>

<style scoped>
.nav-item > .nav-link {
  font-weight: 600;
}
</style>
