<template>
  <div
    id="app"
    class="bg-blue-darker  mx-auto"
  >
    <div class="flex opacity-75">

      <div class="my-2 pl-2 flex justify-center content-center font-fira">
        <router-link
          to="/"
          class="btn-white-outline"
        >
          ClipStream =>
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
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'wall-vue',
};
</script>

<style>
/* CSS */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
