<template>
  <div>
    <b-navbar type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <b-navbar-brand>Livedebug Client</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="home">Home</b-nav-item>
          <b-nav-item :to="favorite">Favorite</b-nav-item>
          <b-nav-item :to="about">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style>

</style>
