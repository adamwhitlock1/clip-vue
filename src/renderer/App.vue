<template>
  <div
    id="app"
    class="bg-blue-darker  mx-auto"
  >
    <div class="flex bg-white w-full fixed pin-t shadow-md mx-auto pt-4 titlebar">

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
    <transition
      name="fade"
      mode="out-in"
    >

      <router-view class="mt-16"></router-view>

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

.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.clip-content div {
  padding: 5px;
  overflow-y: scroll;
  border-radius: 5px;
}
</style>
