import { shallowMount } from '@vue/test-utils';
import IndexPage from '~/pages/index.vue';

describe('Index.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage, {});
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
  });
});
