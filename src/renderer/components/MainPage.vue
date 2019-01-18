<template>

  <div class="container bg-blue-darker mx-auto p-2 mb-16">

    <div class="flex justify-center content-center w-full mt-6 mb-3">
      <span class="mt-2 text-white flex justify-center content-center pl-2 pr-3">Clips: {{ allClip.length }}</span>
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
        class="my-2 pt-1 pl-1 flex bg-white shadow-lg rounded-lg clip-wrapper content-start"
        :style="{'background-color': color.hex}"
        v-for="(clipItem, index) in allClip"
        v-bind:key="'clip'+index"
      >
        <div class="flex w-3/4 items-start mr-2 content-start">

          <div
            class="item-span shadow items-start w-full small p-1 clip-content"
            :style="{color: textColor}"
            v-html="clipItem.html"
            :id="clipItem._id"
          >

          </div>
        </div>

        <div class="w-1/4 mt-2 content-start items-start mx-auto">

          <div class="w-full flex mb-2">

            <button
              v-clipboard:copy=clipItem.text
              v-clipboard:success="onCopy"
              class="btn-blue-outline"
            >
              <v-icon
                name="copy"
                scale=".8"
              />
            </button>

            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="deleteItem(clipItem._id, index)"
            >
              <v-icon
                name="trash"
                scale=".8"
              /></button>

            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="expandSection(clipItem._id)"
            >
              <v-icon
                name="expand"
                scale=".8"
              /></button>
            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="showSavedClipModal(clipItem)"
            >
              <v-icon
                name="save"
                scale=".8"
              /></button>
          </div>

          <div class="w-full">

            <div class="w-50 text-right pr-2">
              <span><small>Created: <time-ago
                    :refresh="10"
                    :datetime="clipItem.createdAt"
                    locale="en"
                    tooltip
                  ></time-ago></small></span>

              <span><small> | {{ clipItem.charCount }} Characters</small></span>

            </div>

          </div>

        </div>
      </div>

    </transition-group>
    <saved-clip-modal
      :clip-data=showModalClipData
      v-if="showModal"
      @close="showModal = false"
    >
    </saved-clip-modal>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';
import 'vue2-timeago/dist/vue2-timeago.css';
import TimeAgo from 'vue2-timeago';
import SavedClipModal from './SaveClipModal';

const { clipboard } = require("electron"); // eslint-disable-line

export default {
  name: 'main-page',
  components: { 'sketch-picker': Sketch, TimeAgo, SavedClipModal },
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
      showModalClipData: {},
      showModal: false,
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
              charCount: currentClipText.length,
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
    showSavedClipModal(clip) {
      this.showModal = true;
      this.showModalClipData = clip;
    },
    getTimeAgo(time) {
      return time;
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
      element.classList.toggle('big');
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

.clip-list-move {
  transition: opacity 1s;
}

.small {
  height: 65px;
  overflow: scroll;
  overflow-x: hidden;
}

.big {
  height: fit-content !important;
}

::-webkit-scrollbar {
  width: 0.75em;
  height: 0.5em;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(124, 47, 47, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  @apply bg-blue;
  outline: 1px solid white;
  border-radius: 10px;
}

::-webkit-scrollbar-corner {
  background-color: rgba(0, 0, 0, 0);
}
</style>
