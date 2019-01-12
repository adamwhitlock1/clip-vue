import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default,
    },
    {
      path: '/options',
      name: 'options',
      component: require('@/components/Options').default,
    },
    {
      path: '/saved-clips',
      name: 'saved-clips',
      component: require('@/components/SavedClips').default,
    },
  ],
});
