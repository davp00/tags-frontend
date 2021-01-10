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
import apolloClient from '~/util/apollo.client';
import { DELETE_TAG_MUTATION } from '~/gql/mutations';
import { UPDATE_TAG_LIST_SUBSCRIPTION } from '~/gql/subscriptions';

export const state = (): MainState => ({
  tags: [],
  page: 1,
  modal: false,
  tag: undefined,
});

const subscriptionList = {
  onSubscriptionNext({ data }: any, commit: any) {
    if (data.updateTagList) {
      const { action, tag } = data.updateTagList;
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
    }
  },
  onSubscriptionError() {
    alert('Ha ocurrido un error en el socket');
  },
};

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

  [ActionTypes.WATCH_TAG_EVENTS]({ commit }: ArgumentedActionContext) {
    const observer = apolloClient.subscribe({
      query: UPDATE_TAG_LIST_SUBSCRIPTION,
    });

    observer.subscribe({
      next: (response) => {
        subscriptionList.onSubscriptionNext(response, commit);
      },
      error: subscriptionList.onSubscriptionError,
    });
  },

  [ActionTypes.DELETE_TAG](_: ArgumentedActionContext, tag: Tag) {
    apolloClient
      .mutate({
        mutation: DELETE_TAG_MUTATION,
        variables: {
          id: tag.id,
        },
      })
      .then(({ data }) => {
        return data.deleteTag;
      });
  },

  [ActionTypes.TOGGLE_MODAL]({ commit }: ArgumentedActionContext, tag: Tag) {
    commit(MutationTypes.TOGGLE_MODAL, undefined);
    commit(MutationTypes.SET_TAG_TO_EDIT, tag);
  },
};
