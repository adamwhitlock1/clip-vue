<template>

  <div class="container bg-blue-darker mx-auto p-2">

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
        v-for="(clipItem, index) in allClip"
        v-bind:key="'clip'+index"
      >
        <div class="flex w-3/4 items-start pt-2 mr-2 content-start">

          <div
            class="item-span items-start w-full small pr-2 font-fira"
            v-html="clipItem.html"
            :id="clipItem._id"
          >

          </div>
        </div>

        <div class="flex w-1/4 mt-4 content-start items-start">

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

        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
const Datastore = require('nedb');
const db = new Datastore({
  filename: 'static/database.db',
  timestampData: true,
  autoload: true,
});

db.find({}, (err, docs) => {
  if (err) console.log(err);
  console.log(docs.length);
});

const { clipboard } = require("electron"); // eslint-disable-line

// function copiedInArray(needle, haystack) {
//   const count = haystack.length;
//   for (let i = 0; i < count; i += 1) {
//     if (haystack[i].text === needle) {
//       return true;
//     }
//   }
//   return false;
// }

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
      isSmall: 'true',
    };
  },
  created() {
    db.find({}, (err, docs) => {
      if (err) console.log(err);
      if (docs.length > 0) {
        this.allClip = docs;
      }
    });

    setInterval(() => {
      const currentClipText = clipboard.readText();
      const currentClipHTML = clipboard.readHTML();

      if (currentClipText !== '') {
        db.find({ text: currentClipText }, (err, docs) => {
          if (docs.length === 0) {
            console.log('no match');

            db.insert({ text: currentClipText, html: currentClipHTML });

            db.find({})
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
    clearDb() {
      db.remove({}, { multi: true }, (err, numRemoved) => {
        console.log(numRemoved);
      });
    },

    expandSection(id) {
      const element = document.getElementById(id);
      if (element.classList.contains('small')) {
        element.classList.remove('small');
      } else {
        element.classList.add('small');
      }
    },

    onCopy() {
      this.$toasted.show('Copied Successfully!', {
        theme: 'outline',
        position: 'bottom-right',
        duration: 2500,
      });
      db.find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          this.allClip = docs;
        });
    },
    deleteItem(id, item) {
      clipboard.clear();
      if (item === 0 && this.allClip.length === 1) {
        db.remove({ _id: id }, {}, (err, numRemoved) => {
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
        db.remove({ _id: id }, {}, (err, numRemoved) => {
          console.log(id);
          console.log(numRemoved);
          db.find({})
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

.item-span div {
  padding: 7px 10px;
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
