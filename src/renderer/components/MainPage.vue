<template>
  <div class="container-fluid">
    <transition-group
      name="clip-list"
      tag="p"
    >
      <div
        class="row m-1 shadow clip-item align-self-center bg-white rounded"
        v-for="(clipItem, index) in allClip"
        v-bind:key="'clip'+index"
      >
        <div
          class="col-sm-10 align-self-center p-3"
          v-clipboard:copy=clipItem.text
          v-clipboard:success="onCopy"
        >
          <div
            class="item-span align-self-center"
            v-html="clipItem.html"
          >

          </div>
        </div>

        <div
          class="col-sm-1 align-self-center p-3"
          v-clipboard:copy=clipItem.text
          v-clipboard:success="onCopy"
        >
          <button
            class="btn btn-primary p-3 shadow"
            title="copy item"
          >
            <v-icon name="copy" /></button>
        </div>

        <div class="col-sm-1 align-self-center p-3">
          <button
            class="btn btn-danger p-3 shadow"
            title="delete item from list"
            @click="deleteItem(index)"
          >
            <v-icon name="ban" /></button>
        </div>
      </div>
    </transition-group>
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
        {
          html: '<span>Welcome to Clip Vue</span>',
          text: 'init text',
          starred: false,
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
      if (this.currentClipHTML !== lastClip && this.currentClipHTML !== '') {
        if (copiedInArray(clipboard.readText(), this.allClip) === false) {
          this.allClip.unshift({
            html: this.currentClipHTML,
            text: this.currentClipText,
          });
        }
        if (
          this.allClip[this.allClip.length - 1].text === 'init text' ||
          this.allClip[this.allClip.length - 1].text === 'All items cleared'
        ) {
          this.allClip.pop();
        }
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
    deleteItem(item) {
      clipboard.clear();
      if (item === 0 && this.allClip.length === 1) {
        this.allClip.unshift({
          html: '<span>All items cleared</span>',
          text: 'All items cleared',
        });
        this.allClip.splice(1, 1);
        this.$toasted.show('ALL Items Deleted', {
          theme: 'outline',
          position: 'bottom-right',
          duration: 2500,
        });
      } else {
        this.allClip.splice(item, 1);
        this.$toasted.show('Item Deleted', {
          theme: 'outline',
          position: 'bottom-right',
          duration: 2500,
        });
      }
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

.clip-list-move {
  transition: transform 1s;
}
</style>
