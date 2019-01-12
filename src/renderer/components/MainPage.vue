<template>

  <div class="container bg-teal mx-auto p-2">

    <transition-group
      name="clip-list"
      tag="p"
    >
      <div
        class="my-2 pl-2 flex bg-white justify-center content-center"
        v-for="(clipItem, index) in allClip"
        v-bind:key="'clip'+index"
      >
        <div class="flex w-3/4 align-self-center pt-2 mr-2">
          <div
            class="item-span align-self-center w-full"
            v-html="clipItem.html"
            :class="{small: isSmall}"
          >

          </div>
        </div>

        <div class="flex w-1/4 align-self-center justify-center content-center">

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
            @click="deleteItem(clipItem._id, index)"
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
  height: 60px;
  overflow: scroll;
}
</style>
