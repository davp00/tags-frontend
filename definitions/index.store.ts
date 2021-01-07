import { ActionContext } from 'vuex';
import { Tag } from '~/definitions/tag';

export interface MainState {
  tags: Tag[];
  page: number;
  modal: boolean;
  tag: Tag | undefined;
}

export enum MutationTypes {
  ADD_TAGS = 'ADD_TAGS',
  UPDATE_PAGE = 'UPDATE_PAGE',
  ADD_TAG = 'ADD_TAG',
  EDIT_TAG = 'EDIT_TAG',
  DELETE_TAG = 'DELETE_TAG',
  TOGGLE_MODAL = 'TOGGLE_MODAL',
  SET_TAG_TO_EDIT = 'SET_TAG_TO_EDIT',
}

export type Mutations<S = MainState> = {
  [MutationTypes.ADD_TAGS](state: S, tags: Tag[]): void;
  [MutationTypes.UPDATE_PAGE](state: S, value: number): void;
  [MutationTypes.ADD_TAG](state: S, tag: Tag): void;
  [MutationTypes.EDIT_TAG](state: S, tag: Tag): void;
  [MutationTypes.DELETE_TAG](state: S, tag: Tag): void;
  [MutationTypes.TOGGLE_MODAL](state: S): void;
  [MutationTypes.SET_TAG_TO_EDIT](state: S, tag: Tag | undefined): void;
};

export enum ActionTypes {
  GET_TAG_LIST = 'GET_TAG_LIST',
  CREATE_TAG = 'ACTION_CREATE_TAG',
  DELETE_TAG = 'ACTION_DELETE_TAG',
  WATCH_TAG_EVENTS = 'WATCH_TAG_EVENTS',
  TOGGLE_MODAL = 'ACTION_TOGGLE_MODAL',
}

export type ArgumentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<MainState, MainState>, 'commit'>;
