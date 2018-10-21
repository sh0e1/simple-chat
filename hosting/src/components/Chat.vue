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
            v-model="room.active"
            prepend-icon="chat"
            no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ room.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list two-linej>
            <template v-for="item in room.items">
              <v-list-tile
                  :key="item.tile"
                  ripple
                  @click=""
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>{{ item.action }}</v-icon>
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
      <v-container fluid>
        <v-layout row>
          <v-flex xs12>
            <div class="white">aaaaaaaa</div>
          </v-flex>
        </v-layout>
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
              <v-btn slot="append-outer" style="top: -12px" flat icon color="primary">
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

  export default {
    name: "Chat",
    data () {
      return {
        drawer: null,
        room: {
          icon: 'chat',
          title: 'Joining Rooms',
          active: true,
          items: [],
        },
        messages: [],
        message: '',
      }
    },
    created: function() {
      firebase.firestore().collection('rooms').orderBy('updated_at', 'desc').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const createdAt = doc.get('created_at')
          const updatedAt = doc.get('updated_at')
          const item = {
            id: doc.id,
            name: doc.get('name'),
            createdAt: createdAt,
            updatedAt: updatedAt,
          }
          this.room.items.push(item)
        })
      }).catch((error) => {
        console.log(error)
        // TODO: error handling
      })
      console.log(this.room)
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