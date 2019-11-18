<template>
  <div class="favorite">
    <b-container>
      <b-row v-if="favorites.length === 0">
        <b-col>
          <h1>Favorite data is empty</h1>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col v-for="favorite in favorites" :key="favorite.id">
          <b-card
            img-alt="Image"
            img-height="200px"
            img-top
            style="width: 20rem; height: 332px"
            :title="favorite.name"
            :img-src="favorite.image"
            >
            <b-button variant="danger" @click="deleteFavorite(favorite)">Delete</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'cars',
  created: function () {
    this.$store.dispatch('fetchFavorites')
  },
  computed: {
    favorites () {
      return this.$store.state.favorites
    }
  },
  methods: {
    deleteFavorite (id) {
      this.$store.dispatch('deleteFavorite', id)
        .then(info => {
          this.popToast({ title: '`Delete Favorites, Success!`', message: 'choose your another cars', variant: 'danger' })
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
.favorite {
  margin-top: 50px;
}
</style>
