<template>
  <div class="detail">
    <h1>{{ car.name }}</h1>
    <b-img center :src="car.image" fluid alt="Responsive image" style="max-width:600px"></b-img>
    <b-button variant="success" @click="addFavorite(id)">Add Favorite</b-button>
  </div>
</template>

<script>
import axios from '@/apis/server.js'

export default {
  name: 'detail',
  data: function () {
    return {
      car: {}
    }
  },
  created: function () {
    this.fetchData()
  },
  watch: {
    '$route.params.id': function () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      const id = this.$route.params.id
      axios.get(`/cars/${id}`)
        .then(({ data }) => {
          this.car = data
        })
        .catch(console.log)
    },
    addFavorite (data) {
      this.$store.dispatch('addFavorite', data)
        .then(info => {
          this.popToast({ title: 'Add Favorites, Success!', message: 'check your favorites tabs', variant: 'success' })
        })
        .catch(err => {
          console.log(err)
          this.popToast({ title: 'Internal Server Error', message: 'please, restart your connection', variant: 'warning' })
        })
    },
    popToast (info) {
      this.$bvToast.toast(info.message, {
        title: info.title,
        variant: info.variant,
        solid: true
      })
    }
  }
}
</script>

<style>
.detail {
  margin-top: 50px;
}
</style>
