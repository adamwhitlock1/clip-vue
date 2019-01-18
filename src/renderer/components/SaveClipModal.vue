<template>

  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container relative p-8 bg-white w-full max-w-md m-auto flex-col flex">

          <div class="modal-header pl-2">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body pl-2">
            <slot name="body">
              <p>{{ clipData._id }}</p>
              <p
                class="clip-content m-2"
                v-html="clipData.html"
              ></p>
              <p>{{ clipData.charCount}}</p>
            </slot>
          </div>

          <div class="modal-footer pb-6">
            <slot name="footer">
              <button
                class="modal-default-button border p-2"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                class="modal-default-button border p-2 mr-2"
                @click="saveClip(clipData)"
              >
                Save
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
export default {
  name: 'SaveClipModal',
  props: ['clipData'],
  data() {
    return {
      showModal: false,
    };
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
            charCount: clip.text.length,
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
        this.$emit('close');
      });
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.33) !important;
  display: table;

  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.33);
}

.modal-container {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>