import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { ActionTypes } from '~/definitions/index.store';
import TagItem from '~/components/TagItem.vue';
import { DELETE_TAG_MUTATION } from '~/gql/mutations';
import { $apolloProvider, $store, testTag as tag } from '~/test/mocks';

describe('TagItem', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(TagItem, {
      propsData: {
        tag,
      },
      mocks: {
        $store,
        $apolloProvider,
      },
    });
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
  });

  it('should trigger edit modal', async function () {
    const editButton = wrapper.find('.tag-item-button-edit');
    await editButton.trigger('click');

    expect($store.dispatch).lastCalledWith(ActionTypes.TOGGLE_MODAL, tag);
  });

  it('should call delete action', async function () {
    const deleteButton = wrapper.find('.tag-item-button-delete');
    deleteButton.trigger('click');

    await flushPromises();

    expect($store.dispatch).lastCalledWith(ActionTypes.DELETE_TAG, tag);
  });

  it('should ignore the mutation', function () {
    wrapper.setData({ isRemoving: true });
    $apolloProvider.defaultClient.mutate.mockClear();

    const deleteButton = wrapper.find('.tag-item-button-delete');
    deleteButton.trigger('click');

    expect($apolloProvider.defaultClient.mutate.mock.calls.length).toBe(0);
  });
});
