import { ActionTree, MutationTree, ActionContext } from 'vuex';
import { Tag } from '~/interfaces/tag';
import { TAG_LIST_QUERY } from '~/gql/querys';

interface MainState {
  tags: Tag[];
  page: number;
  nPages: number;
}

export const state = (): MainState => ({
  tags: [],
  page: 1,
  nPages: 0,
});

export enum MutationTypes {
  ADD_TAGS = 'ADD_TAGS',
  UPDATE_PAGE = 'UPDATE_PAGE',
}

export type Mutations<S = MainState> = {
  [MutationTypes.ADD_TAGS](state: S, tags: Tag[]): void;
  [MutationTypes.UPDATE_PAGE](state: S, value: number): void;
};

export const mutations: MutationTree<MainState> & Mutations = {
  [MutationTypes.ADD_TAGS](state, tags) {
    state.tags = state.tags.concat(tags);
  },
  [MutationTypes.UPDATE_PAGE](state: MainState, value: number): void {
    state.page = value;
  },
};

export enum ActionTypes {
  GET_TAG_LIST = 'GET_TAG_LIST',
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
    console.log(result.data);
    commit(MutationTypes.UPDATE_PAGE, state.page + 1);
    commit(MutationTypes.ADD_TAGS, result.data.tagList.tags);

    return result.data.tagList.tags.length !== 0;
  },
};

export const plugins = [];
