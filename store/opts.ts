import { ActionTree, MutationTree } from 'vuex';
import { binarySearch, tagBinarySearchComparable } from '~/util/binarysearch';
import {
  ActionTypes,
  ArgumentedActionContext,
  MainState,
  Mutations,
  MutationTypes,
} from '~/definitions/index.store';
import { Tag } from '~/definitions/tag';

export const state = (): MainState => ({
  tags: [],
  page: 1,
  modal: false,
  tag: undefined,
});

export const mutations: MutationTree<MainState> & Mutations = {
  [MutationTypes.ADD_TAGS](state, tags) {
    state.tags = state.tags.concat(tags);
  },

  [MutationTypes.UPDATE_PAGE](state, value): void {
    state.page += value;
  },

  [MutationTypes.ADD_TAG](state, tag) {
    state.tags.unshift(tag);
  },

  [MutationTypes.EDIT_TAG](state, tag) {
    const index = binarySearch(state.tags, tagBinarySearchComparable(tag));

    if (index !== null) state.tags[index].name = tag.name;
  },

  [MutationTypes.DELETE_TAG](state, tag) {
    const index = binarySearch(state.tags, tagBinarySearchComparable(tag));
    if (index !== null) {
      state.tags.splice(index, 1);
    }
  },

  [MutationTypes.TOGGLE_MODAL](state) {
    state.modal = !state.modal;
  },

  [MutationTypes.SET_TAG_TO_EDIT](state, tag) {
    state.tag = tag;
  },
};

export const actions: ActionTree<MainState, MainState> = {
  [ActionTypes.GET_TAG_LIST](
    { commit }: ArgumentedActionContext,
    tags: Tag[]
  ): void {
    commit(MutationTypes.UPDATE_PAGE, 1);
    commit(MutationTypes.ADD_TAGS, tags);
  },

  [ActionTypes.WATCH_TAG_EVENTS](
    { commit }: ArgumentedActionContext,
    { action, tag }: any
  ) {
    switch (action) {
      case 'ADD':
        commit(MutationTypes.ADD_TAG, tag);
        break;
      case 'EDIT':
        commit(MutationTypes.EDIT_TAG, tag);
        break;
      case 'DELETE':
        commit(MutationTypes.DELETE_TAG, tag);
        break;
    }
  },

  [ActionTypes.TOGGLE_MODAL]({ commit }: ArgumentedActionContext, tag: Tag) {
    commit(MutationTypes.TOGGLE_MODAL, undefined);
    commit(MutationTypes.SET_TAG_TO_EDIT, tag);
  },
};
