<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column">
        <section class="section">
          <b-field label="How many images to display">
        <b-input v-model.number="numberOfImages"></b-input>
          </b-field>
        </section>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-one-quarter" v-for="n in numberOfImages" v-bind:key="n">
        <img :src="`http://source.unsplash.com/random/${size}sig=${n}`" @click="setAsBackground" class=image crossorigin>
      </div>
  </div>

  <div class="container">
    <div class="columns">
      <div class="column">
        <section class="section">
        <p>Image path: {{imagePath}}</p>
        <p>Height: {{imgHeight}}</p>
        <p>Width {{imgWidth}}</p>
        </section>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import wallpaper from 'wallpaper';
import path from 'path';
import fs from 'fs';
import os from 'os';

export default {
  name: 'landing-page',
  components: {},
  data() {
    return {
      numberOfImages: 4,
      width: window.screen.width,
      height: window.screen.height,
      imagePath: 'this will be replaced by path',
      imgHeight: 0,
      imgWidth: 0,
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    convertToBase64(img) {
      this.imgHeight = img.naturalHeight;
      this.imgWidth = img.naturalWidth;
      const canvas = document.createElement('canvas');
      canvas.width = this.imgWidth;
      canvas.height = this.imgHeight;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpg');
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    },

    setAsBackground(event) {
      const base64Image = this.convertToBase64(event.target);
      let picturePath = path.join(os.homedir(), '/Pictures', 'background.jpg');
      picturePath = path.normalize(picturePath);
      fs.writeFile(picturePath, base64Image, 'base64', (err) => {
        if (err) {
          this.imagePath = err;
        } else {
          this.imagePath = path.resolve(picturePath);
          wallpaper.set(picturePath, { screen: 'all', scale: 'fill' }).then(() => {
            this.$snackbar.open('Done !');
          });
        }
      });
    },

  },
  computed: {
    size() {
      const sizeString = `${this.width}x${this.height}`;
      return sizeString;
    },
  },
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  body { font-family: 'Source Sans Pro', sans-serif; }

img {
  padding: 10px;
}

.image:hover{
    transition: all 0.3s;
    box-shadow: 0 0.3125rem 1rem 0 rgba(0,0,0,0.4);
  }
</style>
