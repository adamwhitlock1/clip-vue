<template>

  <div class="container bg-blue-darker mx-auto p-2 mb-16">

    <div class="my-2 pl-2 flex justify-center content-center">
      <button
        class="btn-white-outline"
        @click="clearDb"
      >
        Clear Clipboard
      </button>
    </div>

    <transition-group
      name="clip-list"
      tag="p"
    >
      <div
        class="my-2 p-4 flex bg-white shadow-lg rounded-lg clip-wrapper content-start"
        :style="{'background-color': color.hex}"
        v-for="(clipItem, index) in allClip"
        v-bind:key="'clip'+index"
      >
        <div class="flex w-3/4 items-start pt-2 mr-2 content-start">

          <div
            class="item-span shadow items-start w-full small p-4 font-fira"
            :style="{color: textColor}"
            v-html="clipItem.html"
            :id="clipItem._id"
          >

          </div>
        </div>

        <div class="w-1/4 mt-4 content-start items-start">

          <div class="w-full flex mb-2">

            <button
              v-clipboard:copy=clipItem.text
              v-clipboard:success="onCopy"
              class="btn-blue-outline"
            >
              <v-icon name="copy" />
            </button>

            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="deleteItem(clipItem._id, index)"
            >
              <v-icon name="ban" /></button>

            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="expandSection(clipItem._id)"
            >
              <v-icon name="expand" /></button>

            <button
              @click="saveClip(clipItem)"
              class="btn-blue-outline"
            >
              <v-icon name="save" />
            </button>

          </div>

          <div
            v-if="isSmall === false"
            class="w-full"
          >

            <div class="text-grey-dark">
              <p>Color: {{ color.hex }}</p>

            </div>

            <sketch-picker
              v-model="color"
              v-if="clipSizes[clipItem._id] === false"
            />
          </div>

        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';
const { clipboard } = require("electron"); // eslint-disable-line

export default {
  name: 'main-page',
  components: { 'sketch-picker': Sketch },
  data() {
    return {
      color: 'inherit',
      textColor: 'inherit',
      allClip: [],
      allSavedClip: [],
      clipboardAvailFormats: clipboard.availableFormats(),
      currentClipHTML: '',
      currentClipText: '',
      isSmall: true,
      clipSizes: {},
    };
  },
  created() {
    this.$dbStream
      .find({})
      .sort({ createdAt: -1 })
      .exec((err, docs) => {
        this.allClip = docs;
      });

    setInterval(() => {
      const currentClipText = clipboard.readText();
      const currentClipHTML = clipboard.readHTML();

      if (currentClipText !== '') {
        this.$dbStream.find({ text: currentClipText }, (err, docs) => {
          if (docs.length === 0) {
            console.log('no match');

            this.$dbStream.insert({
              text: currentClipText,
              html: currentClipHTML,
            });

            this.$dbStream
              .find({})
              .sort({ createdAt: -1 })
              .exec((err, docs) => {
                this.allClip = docs;
                console.log(`INSERTED new length: ${docs.length}`);
                console.log(currentClipText);
              });
          }
        });
      }
      // console.log(currentClipHTML);
    }, 1000);
  },
  methods: {
    saveClip(clip) {
      this.$dbSaved.find({ text: clip.text }, (err, docs) => {
        if (docs.length === 0) {
          console.log('no match');

          this.$dbSaved.insert({
            text: clip.text,
            html: clip.html,
            stream_id: clip._id,
            stream_createAt: clip.createdAt,
          });

          this.$dbSaved
            .find({})
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
              this.allSavedClip = docs;
              console.log(`INSERTED new length: ${docs.length}`);
              console.log(clip.text);
            });
        } else {
          console.log('Entry allready in saved clips!');
        }
      });
    },

    clearDb() {
      this.$dbStream.remove({}, { multi: true }, (err, numRemoved) => {
        console.log(numRemoved);
      });
      console.log('CLEAR_DB');
    },

    expandSection(id) {
      const element = document.getElementById(id);
      console.log(element.id);
    },

    onCopy() {
      this.$toasted.show('Copied Successfully!', {
        theme: 'outline',
        position: 'bottom-right',
        duration: 2500,
      });
    },
    deleteItem(id, item) {
      clipboard.clear();
      console.log('delete item');
      console.log(id);
      console.log(item);

      if (item === 0 && this.allClip.length === 1) {
        this.$dbStream.remove({ _id: id }, {}, (err, numRemoved) => {
          console.log(numRemoved);
        });
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
        this.$dbStream.remove({ _id: id }, {}, (err, numRemoved) => {
          console.log(id);
          console.log(numRemoved);
          this.$dbStream
            .find({})
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
              this.allClip = docs;
            });
        });
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

.clip-list-move {
  transition: opacity 1s;
}

.small {
  height: 55px;
  overflow: scroll;
  transition: 0.5s;
  overflow-x: hidden;
}

.clip-wrapper:hover .small {
  height: 150px;
}

*::-webkit-scrollbar {
  width: 0.5em;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(124, 47, 47, 0.2);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb {
  @apply bg-blue;
  outline: 1px solid white;
  border-radius: 10px;
}

*::-webkit-scrollbar-corner {
  background-color: rgba(0, 0, 0, 0);
}
</style>
