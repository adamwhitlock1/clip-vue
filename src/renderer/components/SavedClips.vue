<template>

  <div class="container bg-blue-darker mx-auto p-2">

    <transition-group
      name="clip-list"
      tag="p"
    >
      <div
        class="my-2 p-4 flex bg-white shadow-lg rounded-lg clip-wrapper content-start"
        :style="{'background-color': color.hex}"
        v-for="(clipItem, index) in savedClip"
        v-bind:key="'clip'+index"
      >
        <div class="flex w-3/4 items-start pt-2 mr-2 content-start">

          <span>{{clipItem._id}}</span>

          <div
            class="item-span shadow items-start w-full small p-4 font-fira"
            v-html="clipItem.html"
            :id="clipItem._id"
          >

          </div>
        </div>

        <div class="w-1/4 mt-4 content-start items-start">

          <div class="w-full flex mb-2">

            <button class="btn-blue-outline">
              <v-icon name="copy" />
            </button>

            <button
              class="btn-blue-outline"
              title="delete item from list"
              @click="deleteItem(clipItem._id, clipItem)"
            >
              <v-icon name="ban" /></button>

            <button class="btn-blue-outline">
              <v-icon name="expand" /></button>

            <button class="btn-blue-outline">
              <v-icon name="save" />
            </button>

          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
const { clipboard } = require("electron"); // eslint-disable-line
export default {
  name: 'saved-clips',
  components: {},
  data() {
    return {
      savedClip: [],
      color: {
        hex: '#ffffff',
      },
    };
  },
  created() {
    this.$dbSaved
      .find({})
      .sort({ createdAt: -1 })
      .exec((err, docs) => {
        this.savedClip = docs;
      });
  },
  methods: {
    clearDb() {
      this.$dbSaved.remove({}, { multi: true }, (err, numRemoved) => {
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

      if (item === 0 && this.savedClip.length === 1) {
        this.$dbSaved.remove({ _id: id }, {}, (err, numRemoved) => {
          console.log(numRemoved);
        });
        this.savedClip.unshift({
          html: '<span>All items cleared</span>',
          text: 'All items cleared',
        });
        this.savedClip.splice(1, 1);
        this.$toasted.show('ALL Items Deleted', {
          theme: 'outline',
          position: 'bottom-right',
          duration: 2500,
        });
      } else {
        this.$dbSaved.remove({ _id: id }, {}, (err, numRemoved) => {
          console.log(id);
          console.log(numRemoved);
          this.$dbSaved
            .find({})
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
              this.savedClip = docs;
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
