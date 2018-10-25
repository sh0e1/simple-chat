<template>
  <v-parallax dark src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
    <v-layout align-center column justify-end fill-height>
      <h1 class="display-2">Simple Chat</h1>
    </v-layout>
    <v-layout align-center row fill-height>
      <v-layout justify-center>
        <v-btn large @click="signInAnonymously">Use in guest</v-btn>
      </v-layout>
      <v-layout justify-center>
        <v-btn large dark color="blue darken-2" @click="signUpForm.isShow = true">Sign up</v-btn>
        <v-btn large @click="signInForm.isShow = true">Sign in</v-btn>
      </v-layout>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="signUpForm.isShow" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Sign up form</span>
          </v-card-title>
          <v-card-text>
            <v-layout column align-space-around justify-center px-3>
              <v-flex>
                <v-text-field
                    label="Username"
                    single-line
                    required
                    color="blue darken-2"
                    prepend-icon="person"
                    type="text"
                    v-model="signUpForm.username"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                    label="Email"
                    single-line
                    required
                    color="blue darken-2"
                    prepend-icon="email"
                    type="email"
                    v-model="signUpForm.email"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                    label="Password"
                    single-line
                    required
                    color="blue darken-2"
                    prepend-icon="vpn_key"
                    type="password"
                    v-model="signUpForm.password"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="blue darken-2" flat @click="signUpForm.isShow = false">Close</v-btn>
              <v-btn color="blue darken-2" flat @click="signUp">Sign up</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="signInForm.isShow" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Sign in form</span>
          </v-card-title>
          <v-card-text>
            <v-layout column align-space-around justify-center px-3>
              <v-flex>
                <v-text-field
                    label="Email"
                    single-line
                    required
                    color="blue darken-2"
                    prepend-icon="email"
                    type="email"
                    v-model="signInForm.email"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                    label="Password"
                    single-line
                    required
                    color="blue darken-2"
                    prepend-icon="vpn_key"
                    type="password"
                    v-model="signInForm.password"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-2" flat @click="signInForm.isShow = false">Close</v-btn>
            <v-btn color="blue darken-2" flat @click="signIn">Sign in</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-parallax>
</template>

<script>
  import * as firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    data () {
      return {
        signUpForm: {
          isShow: false,
          username: '',
          email: '',
          password: ''
        },
        signInForm: {
          isShow: false,
          email: '',
          password: ''
        },
      }
    },
    methods: {
      signInAnonymously: function() {
        firebase.auth().signInAnonymously().then(() => {
          this.$router.push('chat')
        })
      },
      signUp: function () {
        if (this.signUpForm.email === '' || this.signUpForm.password === '') {
          return false
        }
        firebase.auth().createUserWithEmailAndPassword(this.signUpForm.email, this.signUpForm.password).then(() => {
          const user = firebase.auth().currentUser
          user.updateProfile({
            displayName: this.signUpForm.username
          }).then(() => {
            this.$router.push('chat')
          })
        })
      },
      signIn: function() {
        firebase.auth().signInWithEmailAndPassword(this.signInForm.email, this.signInForm.password).then(() => {
          this.$router.push('chat')
        })
      }
    }
  }
</script>

<style scoped>
</style>
