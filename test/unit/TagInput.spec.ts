import { shallowMount } from '@vue/test-utils';
import { $apolloProvider, $store } from '~/test/mocks';
import TagInput from '~/components/TagInput.vue';
import { CREATE_TAG_MUTATION } from '~/gql/mutations';

describe('TagInput.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = shallowMount(TagInput, {
      mocks: {
        $store,
        $apolloProvider,
      },
    });
  });

  it('should send create tag mutation', async function () {
    const newTagName = 'new tag test';
    await wrapper.setData({ tagName: newTagName });

    const form = wrapper.find('form');

    await form.trigger('submit');

    expect($apolloProvider.defaultClient.mutate).lastCalledWith({
      mutation: CREATE_TAG_MUTATION,
      variables: { name: newTagName },
    });
    expect(wrapper.vm.tagName).toEqual('');
  });

  it('should skip create tag', async function () {
    await wrapper.setData({ tagName: '            ' });

    const form = wrapper.find('form');
    await form.trigger('submit');

    expect(wrapper.vm.tagName).toEqual('');
  });
});
