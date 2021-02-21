<template>
  <nav class="navbar is-link" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="db-nav-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="db-nav-menu" class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">
          Homepage
        </router-link>
        <router-link to="/blog/" class="navbar-item">
          Blog Posts
        </router-link>
        <router-link to="/rants/" class="navbar-item">
          Rants
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavPanel'
}
</script>

<style>
</style>
