import Vuex from 'vuex'
import axios from '@/apis/server.js'

export default new Vuex.Store({
  state: {
    cars: {},
    favorites: {}
  },
  mutations: {
    INITIALCARS (state, payload) {
      state.cars = payload
    },
    INITIALFAVORITES (state, payload) {
      state.favorites = payload
    },
    ADDFAVORITE (state, payload) {
      state.favorites.push(payload)
    },
    REMOVEFAVORITE (state, payload) {
      state.favorites = state.favorites.filter(favorite => favorite.id !== payload)
    }
  },
  actions: {
    fetchCars ({ commit }, payload) {
      axios.get('/cars')
        .then(({ data }) => {
          commit('INITIALCARS', data)
        })
        .catch(console.log)
    },
    fetchFavorites ({ commit }, payload) {
      axios.get('/favorites')
        .then(({ data }) => {
          commit('INITIALFAVORITES', data)
        })
        .catch(console.log)
    },
    addFavorite ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('/favorites/', payload)
          .then(({ data }) => {
            commit('ADDFAVORITE', data)
            resolve('success')
          })
          .catch(reject)
      })
    },
    deleteFavorite ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.delete('/favorites/' + payload)
          .then(({ data }) => {
            commit('REMOVEFAVORITE', payload)
            resolve('success')
          })
          .catch(reject)
      })
    }
  }
})
