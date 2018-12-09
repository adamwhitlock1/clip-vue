<template>
  <div class="container">
    <div
      class="row mt-4 clip-item"
      v-for="(clipItem, index) in allClip"
      v-bind:key="'clip'+index"
      v-clipboard:copy=clipItem.text
      v-clipboard:success="onCopy"
    >
      <div class="col-md-11">
        <span
          class="item-span"
          v-html="clipItem.html"
        >
          <v-icon name="beer" />
        </span>
      </div>

      <div class="col-md-1">
        <button class="btn btn-info btn-block shadow">copy</button>
      </div>
    </div>

  </div>
</template>

<script>
// import path from 'path';
// import fs from 'fs';
// import os from 'os';
const { clipboard } = require("electron"); // eslint-disable-line

function copiedInArray(needle, haystack) {
  const count = haystack.length;
  for (let i = 0; i < count; i += 1) {
    if (haystack[i].text === needle) {
      return true;
    }
  }
  return false;
}

export default {
  name: 'main-page',
  components: {},
  data() {
    return {
      allClip: [
        { html: '<span>Welcome to Vue Copy</span>', text: 'init text' },
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

      const isUndefined = typeof this.allClip[0].html;
      if (isUndefined !== 'undefined') {
        const lastClip = this.allClip[0].html;
        if (this.currentClipHTML !== lastClip) {
          if (copiedInArray(clipboard.readText(), this.allClip) === false) {
            this.allClip.unshift({
              html: this.currentClipHTML,
              text: this.currentClipText,
            });
          }
          if (this.allClip[this.allClip.length - 1].text === 'init text') {
            this.allClip.pop();
          }
        }
      } else if (copiedInArray(clipboard.readText(), this.allClip) === false) {
        this.allClip.unshift({
          html: this.currentClipHTML,
          text: this.currentClipText,
        });
      }
    }, 1000);
  },
  methods: {
    onCopy() {
      this.$toasted.show('Copied Successfully!', {
        theme: 'outline',
        position: 'bottom-right',
        duration: 2500,
      });
    },
  },
  computed: {},
};
</script>

<style>
/* Theming */
body {
  transition: 0.4s;
}

.clip-item:hover {
  cursor: pointer;
}

.item-span div {
  padding: 7px 10px;
}
</style>
