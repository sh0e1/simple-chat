<template>
  <v-app>
    <v-navigation-drawer
        app
        :clipped="$vuetify.breakpoint.lgAndUp"
        v-model="drawer"
        fixed
    >
      <v-list>
        <v-list-group
            v-model="rooms.active"
            prepend-icon="chat"
            no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ rooms.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list>
            <template v-for="room in rooms.items">
              <v-list-tile
                  :key="room.name"
                  ripple
                  @click="changeRoom(room)"
                  v-model="room.active"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ room.name }}
                    <span class="pl-2 grey--text caption">{{ distanceInWordsNow(room.updated_at) }}</span>
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>{{ room.action }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
        app
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        color="primary"
        dark
        fixed
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Simple Chat</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid v-show="isLoading">
        <v-layout row justify-center class="pa-3">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
      <v-container fluid v-show="!isLoading">
        <template v-for="msg in messages">
          <v-layout row justify-start class="mb-3">
            <!--
            <v-avatar v-if="msg.sender.image" size="48px">
              <img :src="msg.sender.image">
            </v-avatar>
            -->
            <v-avatar class="primary" size="48px">
              <v-icon dark>account_circle</v-icon>
            </v-avatar>
            <v-flex class="ml-3 message">
              <strong>{{ msg.sender.name }}</strong><span class="pl-3 caption">{{ distanceInWordsNow(msg.created_at) }}</span><br>
              <span>{{ msg.text }}</span>
            </v-flex>
          </v-layout>
        </template>
      </v-container>
      <v-container id="sender" class="elevation-1" fluid>
        <v-layout row>
          <v-flex>
            <v-text-field
                v-model="message"
                outline
                clearable
                label="Message"
                type="text"
                single-line
                hide-details
            >
              <v-btn slot="append-outer" style="top: -12px" flat icon color="primary" @click="sendTextMessage">
                <v-icon>send</v-icon>
              </v-btn>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import * as firebase from 'firebase/app'
  import 'firebase/firestore'
  import distanceInWordsNow from 'date-fns/distance_in_words_to_now'

  export default {
    name: "Chat",
    data () {
      return {
        drawer: null,
        isLoading: true,
        rooms: {
          icon: 'chat',
          title: 'Joining Rooms',
          active: true,
          items: [],
        },
        currentRoom: {},
        cursor: {},
        messages: [],
        message: '',
      }
    },
    created: function() {
      this.loadRooms()
        .then(() => this.loadLatestMessage())
        .then(() => this.loadMessages())
        .then(() => {
          this.isLoading = false;
        });
    },
    methods: {
      init: function(room) {
        this.isLoading = true;
        this.currentRoom = room;
        this.cursor = {};
        this.messages = [];
      },
      loadRooms: function() {
        return new Promise((resolve, reject) => {
          firebase.firestore().collection('rooms').orderBy('updated_at', 'desc').get().then((snapshot) => {
            snapshot.forEach((doc) => {
              const room = doc.data();
              room.id = doc.id;
              room.active = false;
              this.rooms.items.push(room)
            });
            this.rooms.items[0].active = true;
            this.currentRoom = this.rooms.items[0];
            return resolve();
          }).catch((error) => {
            console.error(error);
            return reject(error);
          })
        })
      },
      loadLatestMessage: function() {
        return new Promise((resolve, reject) => {
          firebase.firestore().collection('rooms').doc(this.currentRoom.id)
              .collection('messages').orderBy('created_at', 'desc').limit(1).onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              this.cursor = doc;
              const msg = doc.data();
              msg.id = doc.id;
              this.messages.push(msg);
            });
            return resolve();
          }, (error) => {
            console.error(error);
            return reject(error);
          })
        })
      },
      loadMessages: function() {
        return new Promise((resolve, reject) => {
          firebase.firestore().collection('rooms').doc(this.currentRoom.id).collection('messages')
              .orderBy('created_at', 'desc').startAfter(this.cursor).limit(20).get().then((snapshot) => {
            snapshot.forEach((doc) => {
              const msg = doc.data();
              msg.id = doc.id;
              this.messages.unshift(msg);
            });
            return resolve();
          }, (error) => {
            console.error(error);
            return reject(error);
          })
        })
      },
      changeRoom: function(room) {
        this.init(room);
        for (let i = 0; i < this.rooms.items.length; i++) {
          if (room.id === this.rooms.items[i].id) {
            this.rooms.items[i].active = true;
          } else {
            this.rooms.items[i].active = false;
          }
        }
        this.loadLatestMessage()
          .then(() => this.loadMessages())
          .then(() => {
            this.isLoading = false;
          });
      },
      sendTextMessage: function(e) {
        if (this.message === '') {
          return false
        }

        const msg = {
          type: 'text',
          text: this.message,
          created_at: new Date(),
        };
        firebase.firestore().collection('rooms').doc(this.currentRoom.id)
            .collection('messages').add(msg).then((doc) => {
          msg.id = doc.id;
          this.message = '';
        }).catch((error) => {
          console.error(error);
        });
      },
      distanceInWordsNow: function (date) {
        return distanceInWordsNow(date)
      },
    }
  }
</script>

<style scoped>
#sender {
  position: absolute;
  bottom: 0;
  background-color: #fff;
}
</style>