import { ActionTree, MutationTree, ActionContext } from 'vuex';
import { Tag } from '~/interfaces/tag';
import { TAG_LIST_QUERY } from '~/gql/querys';
import { CREATE_TAG_MUTATION, DELETE_TAG_MUTATION } from '~/gql/mutations';
import { UPDATE_TAG_LIST_SUBSCRIPTION } from '~/gql/subscriptions';
import { binarySearch, tagBinarySearchComparable } from '~/util/binarysearch';

interface MainState {
  tags: Tag[];
  page: number;
}

export const state = (): MainState => ({
  tags: [],
  page: 1,
});

export enum MutationTypes {
  ADD_TAGS = 'ADD_TAGS',
  UPDATE_PAGE = 'UPDATE_PAGE',
  ADD_TAG = 'ADD_TAG',
  EDIT_TAG = 'EDIT_TAG',
  DELETE_TAG = 'DELETE_TAG',
}

export type Mutations<S = MainState> = {
  [MutationTypes.ADD_TAGS](state: S, tags: Tag[]): void;
  [MutationTypes.UPDATE_PAGE](state: S, value: number): void;
  [MutationTypes.ADD_TAG](state: S, tag: Tag): void;
  [MutationTypes.EDIT_TAG](state: S, tag: Tag): void;
  [MutationTypes.DELETE_TAG](state: S, tag: Tag): void;
};

export const mutations: MutationTree<MainState> & Mutations = {
  [MutationTypes.ADD_TAGS](state, tags) {
    state.tags = state.tags.concat(tags);
  },

  [MutationTypes.UPDATE_PAGE](state, value): void {
    state.page = value;
  },

  [MutationTypes.ADD_TAG](state, tag) {
    state.tags.unshift(tag);
  },

  [MutationTypes.EDIT_TAG](state, tag) {
    const index = binarySearch(state.tags, tagBinarySearchComparable(tag));

    if (index !== null) state.tags[index].name = tag.name;
  },

  [MutationTypes.DELETE_TAG](state, tag) {
    console.time('binarySearch');
    const index = binarySearch(state.tags, tagBinarySearchComparable(tag));
    console.timeEnd('binarySearch');
    if (index !== null) {
      console.time('deleteIndex');
      state.tags.splice(index, 1);
      console.timeEnd('deleteIndex');
    }
  },
};

export enum ActionTypes {
  GET_TAG_LIST = 'GET_TAG_LIST',
  CREATE_TAG = 'CREATE_TAG',
  DELETE_TAG = 'DELETE_TAG',
  WATCH_TAG_EVENTS = 'WATCH_TAG_EVENTS',
}

type ArgumentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<MainState, MainState>, 'commit'>;

export const actions: ActionTree<MainState, MainState> = {
  async [ActionTypes.GET_TAG_LIST]({
    commit,
    state,
  }: ArgumentedActionContext): Promise<boolean> {
    const result = await this.app.apolloProvider.defaultClient.query({
      query: TAG_LIST_QUERY,
      variables: {
        pagination: {
          limit: 10000,
          page: state.page,
        },
      },
    });

    commit(MutationTypes.UPDATE_PAGE, state.page + 1);
    commit(MutationTypes.ADD_TAGS, result.data.tagList.tags);

    return result.data.tagList.tags.length !== 0;
  },

  async [ActionTypes.CREATE_TAG](
    context: ArgumentedActionContext,
    name: string
  ) {
    const result = await this.app.apolloProvider.defaultClient.mutate({
      mutation: CREATE_TAG_MUTATION,
      variables: {
        name,
      },
    });

    return result.data.createTag;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async [ActionTypes.DELETE_TAG](context: ArgumentedActionContext, id: string) {
    const result = await this.app.apolloProvider.defaultClient.mutate({
      mutation: DELETE_TAG_MUTATION,
      variables: {
        id,
      },
    });

    return result.data.deleteTag;
  },

  [ActionTypes.WATCH_TAG_EVENTS]({ commit }: ArgumentedActionContext) {
    const observer = this.app.apolloProvider.defaultClient.subscribe({
      query: UPDATE_TAG_LIST_SUBSCRIPTION,
    });

    observer.subscribe({
      async next({ data }: any) {
        if (data.updateTagList) {
          await Promise.resolve();
          const { action, tag } = data.updateTagList;
          console.log(action);
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
      error() {
        alert('Ha ocurrido un error en el socket');
      },
    });
  },
};

export const plugins = [];
