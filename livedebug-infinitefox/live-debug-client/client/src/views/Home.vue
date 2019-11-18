<template>
  <div>
    <Jumbotron></Jumbotron>
    <b-container>
      <b-row>
        <b-col v-for="car in cars" :key="car.id">
          <b-card
            img-alt="Image"
            img-top
            img-height="200px"
            style="width: 20rem; height: 332px"
            :title="car.name"
            :img-src="car.image"
            >
            <b-button variant="primary" @click="goToDetail(car.id)">Detail</b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Jumbotron from '@/components/Jumbotron.vue'

export default {
  name: 'cars',
  components: {
    Jumbotron
  },
  created: function () {
    this.$store.commit('fetchCars')
  },
  computed: {
    cars () {
      return this.$store.state.cars
    }
  },
  methods: {
    goToDetail (id) {
      this.$router.push(`/${id}`)
    }
  }
}
</script>

<style>

</style>
