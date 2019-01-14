<template>
  <div>
    <h1>Make this app even awesomer.</h1>

    <button>Toggle Color Picker</button>

    <div
      class="current-color"
      :style="{'background-color': color.hex}"
    ></div>

    <div class="text-white">
      <p>{{ color.hex }}</p>
    </div>

    <sketch-picker v-model="color" />

  </div>
</template>

<script>
import { Sketch } from 'vue-color';

export default {
  components: {
    'sketch-picker': Sketch,
  },
  data() {
    return {
      color: '#ffffff',
    };
  },
  methods: {},
};
</script>

<style scoped>
.current-color {
  width: 75px;
  height: 75px;
  background-color: rebeccapurple;
}
</style>