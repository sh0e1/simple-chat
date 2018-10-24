import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null
  },
  getters: {
    isSignedIn: state => {
      return state.currentUser !== null
    },
    isAnonymous: state => {
      return state.currentUser !== null && state.currentUser.isAnonymous
    }
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    }
  },
  actions: {
    init (context) {
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            context.commit('setCurrentUser', user)
          } else {
            context.commit('setCurrentUser', null)
          }
          resolve()
        })
      })
    }
  }
})
