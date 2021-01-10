import { shallowMount } from '@vue/test-utils';
import Card from '~/components/Card.vue';

describe('Card.vue', () => {
  let wrapper: any;
  const title = 'TEST';

  beforeEach(() => {
    wrapper = shallowMount(Card, {
      propsData: {
        title,
      },
    });
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render title', function () {
    expect(wrapper.find('h4').text()).toEqual(title);
  });
});
