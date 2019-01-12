<template>
  <div
    id="app"
    class="bg-blue-darker  mx-auto"
  >
    <div class="flex">

      <div class="my-2 pl-2 flex justify-center content-center">
        <router-link
          to="/"
          class="btn-white-outline"
        >
          ClipStream
        </router-link>
      </div>
      <div class="my-2 pl-2 flex justify-center content-center">
        <router-link
          to="/saved-clips"
          class="btn-white-outline"
        >
          Saved Clips
        </router-link>
      </div>
      <div class="my-2 pl-2 flex justify-center content-center">
        <router-link
          to="/options"
          class="btn-white-outline"
        >
          Options
        </router-link>
      </div>
      <div class="my-2 pl-2 flex justify-center content-center">
        <router-link
          to=""
          class="btn-white-outline"
        >
          Share Clip
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'wall-vue',
};
</script>

<style>
/* CSS */
</style>
