const state = {
  clips: [
    {
      _id: 'dummyId_from_VUEX',
      text: 'sample text from VUEX',
      html: 'sample html content from VUEX',
      createdAt: 'sample created time from VUEX',
      modifiedAt: 'samle modified time from VUEX',
    },
  ],
};

const getters = {
  savedClips: state => state.clips,
};
const mutations = {
  setSavedClips: (state, clips) => {
    state.clips = clips;
  },
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
