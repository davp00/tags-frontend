import { shallowMount } from '@vue/test-utils';
import TagList from '~/components/TagList.vue';
import { $store } from '~/test/mocks';
import { Tag } from '~/definitions/tag';
import { TAG_LIST_QUERY, TAG_LIST_QUERY_LIMIT } from '~/gql/querys';
import { ActionTypes } from '~/definitions/index.store';

jest.mock('../../util/apollo.client');
jest.spyOn(global, 'fetch');

const tags: Tag[] = [
  { name: 'TEST1', pid: 1, color: '#ffffff', id: 'testId1' },
  { name: 'TEST1', pid: 2, color: '#ffffff', id: 'testId2' },
  { name: 'TEST3', pid: 3, color: '#ffffff', id: 'testId3' },
];

export const $apolloProvider = {
  defaultClient: {
    query: jest.fn(() => {
      return { data: { tagList: { tags } } };
    }),
  },
};

const $infiniteScrollState = {
  loaded: jest.fn(),
  complete: jest.fn(),
};

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('TagList.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(TagList, {
      mocks: {
        $store,
        $apolloProvider,
      },
    });
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
  });

  it('should get tag list', function () {
    expect($apolloProvider.defaultClient.query).lastCalledWith({
      query: TAG_LIST_QUERY,
      variables: { pagination: { page: 1, limit: TAG_LIST_QUERY_LIMIT } },
    });

    expect($store.dispatch).lastCalledWith(ActionTypes.GET_TAG_LIST, tags);
  });

  it('should init subscription', function () {
    // expect($store.dispatch).lastCalledWith(ActionTypes.WATCH_TAG_EVENTS);
  });

  describe('Infinite Scroll', () => {
    beforeEach(() => {
      $apolloProvider.defaultClient.query.mockClear();
    });

    it('should continue with infinite scroll', async function () {
      wrapper.vm.infiniteScroll($infiniteScrollState);

      expect($apolloProvider.defaultClient.query).toHaveBeenCalled();

      await setTimeout(() => {
        expect($infiniteScrollState.loaded).toHaveBeenCalled();
      }, 110);
    });

    it('should call infinite scroll loaded', function () {
      beforeEach(() => {
        $infiniteScrollState.loaded.mockClear();
      });

      wrapper.vm.onNewTagItems($infiniteScrollState, true);

      expect($infiniteScrollState.loaded).toHaveBeenCalled();
      expect(wrapper.vm.loading).toBe(false);
    });

    it('should stop infinite scroll', function () {
      wrapper.vm.onNewTagItems($infiniteScrollState, false);

      expect($infiniteScrollState.complete).toHaveBeenCalled();
    });

    it('should skip get next items', function () {
      beforeEach(() => {
        $apolloProvider.defaultClient.query.mockClear();
      });

      wrapper.setData({ loading: true });
      wrapper.vm.infiniteScroll($infiniteScrollState);

      expect($apolloProvider.defaultClient.query).not.toHaveBeenCalled();
    });
  });

  /* describe('Subscription', () => {
    it('should update tag list on subscription next', function () {
      const data = {
        updateTagList: {},
      };

      wrapper.vm.onSubscriptionNext({ data });

      expect($store.dispatch).lastCalledWith(
        ActionTypes.WATCH_TAG_EVENTS,
        data.updateTagList
      );
    });

    it('should skip update tag list on subscription without data', function () {
      $store.dispatch.mockClear();

      const data = {};

      wrapper.vm.onSubscriptionNext({ data });

      expect($store.dispatch).not.toHaveBeenCalled();
    });

    it('should run on subscription error method', function () {
      wrapper.vm.onSubscriptionError();
      expect(window.alert).toHaveBeenCalled();
    });
  }); */
});
