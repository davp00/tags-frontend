import { mount, shallowMount } from '@vue/test-utils';
import ModalEdit from '~/components/ModalEdit.vue';
import {
  $apolloProvider as $defaultApolloProvider,
  $store,
  testTag,
} from '~/test/mocks';
import Modal from '~/components/Modal.vue';
import { ActionTypes } from '~/definitions/index.store';
import { EDIT_TAG_MUTATION } from '~/gql/mutations';
import { Tag } from '~/definitions/tag';

const $apolloProvider = {
  defaultClient: {
    mutate: jest.fn(() => {
      return { data: { editTag: true } };
    }),
  },
};

describe('ModalEdit.vue', () => {
  let wrapper: any;
  let wrapperModal: any;

  function getOptions($store: any, $apolloProvider: any) {
    return {
      computed: {
        modal: () => true,
        tag: () => testTag,
      },
      mocks: {
        $store,
        $apolloProvider,
      },
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = mount(ModalEdit, getOptions($store, $apolloProvider));
    wrapperModal = wrapper.findComponent(Modal);
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
    expect(wrapperModal.exists()).toBe(true);
  });

  it('should toggle modal', async function () {
    const closeButton = wrapperModal.find('.modal-close-button');
    await closeButton.trigger('click');

    expect($store.dispatch).lastCalledWith(ActionTypes.TOGGLE_MODAL, undefined);
    expect(wrapper.vm.error).toBe(false);
  });

  it('should send edit mutation', async function () {
    const submitButton = wrapperModal.find('.modal-submit-button');

    await wrapper.setData({ name: testTag.name });

    await submitButton.trigger('click');

    expect($apolloProvider.defaultClient.mutate).lastCalledWith({
      mutation: EDIT_TAG_MUTATION,
      variables: { id: testTag.id, name: testTag.name },
    });
  });

  it('should reset the modal', function () {
    wrapper.vm.$options.watch.tag.call(wrapper.vm, null);

    expect(wrapper.vm.name).toEqual('');
    expect(wrapper.vm.loading).toEqual(false);
  });

  it('should set tag to edit', function () {
    const tag: Tag = {
      name: 'new tag test',
      color: '#ffffff',
      pid: 112,
      id: 'testId2',
    };

    wrapper.vm.$options.watch.tag.call(wrapper.vm, tag);

    expect(wrapper.vm.name).toEqual(tag.name);
  });

  it('should show error on tag not found', async function () {
    wrapper = shallowMount(
      ModalEdit,
      getOptions($store, $defaultApolloProvider)
    );

    await wrapper.vm.onSubmit();

    expect(wrapper.vm.error).toBe(true);
    expect(wrapper.find('p').exists()).toBeTruthy();
  });
});
