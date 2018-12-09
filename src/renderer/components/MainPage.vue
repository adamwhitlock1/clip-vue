<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column">
        <section class="section">
          <ul
            v-for="(clipItem, index) in allClip"
            v-bind:key="'clip'+index"
          >
            <li>
              <span v-html="clipItem.html"></span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
// import path from 'path';
// import fs from 'fs';
// import os from 'os';
const { clipboard } = require("electron"); // eslint-disable-line

export default {
  name: 'main-page',
  components: {},
  data() {
    return {
      allClip: [
        {
          html: '<span>Welcome to Clip Vue!</span>',
          text: 'Welcome to Clip Vue!',
        },
      ],
      clipboardAvailFormats: clipboard.availableFormats(),
      currentClipHTML: '',
      currentClipText: '',
    };
  },
  created() {
    setInterval(() => {
      this.currentClipHTML = clipboard.readHTML();
      this.currentClipText = clipboard.readText();
      const lastClip = this.allClip[0].html;
      if (this.currentClipHTML !== lastClip) {
        this.allClip.unshift({
          html: this.currentClipHTML,
          text: this.currentClipText,
        });
        console.log('PUSHING TO ARRAY');
        // console.log(allClip);
      }
    }, 3000);
  },
  methods: {},
  computed: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
body {
  font-family: "Source Sans Pro", sans-serif;
}

img {
  padding: 10px;
}

.image:hover {
  transition: all 0.3s;
  box-shadow: 0 0.3125rem 1rem 0 rgba(0, 0, 0, 0.4);
}
</style>
