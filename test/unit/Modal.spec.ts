import { shallowMount } from '@vue/test-utils';
import Modal from '~/components/Modal.vue';

describe('Modal.vue', function () {
  let wrapper: any;
  const title = 'TEST_MODAL';

  beforeEach(() => {
    wrapper = shallowMount(Modal, {
      propsData: {
        show: true,
        title,
      },
    });
  });

  it('should render', function () {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render title', function () {
    expect(wrapper.find('h3').text()).toEqual(title);
  });

  it('should close modal', function () {
    const closeButton = wrapper.find('.modal-close-button');
    closeButton.trigger('click');
    expect(wrapper.emitted('togglemodal')).toBeTruthy();
  });

  it('should emit the submit event', function () {
    const submitButton = wrapper.find('.modal-submit-button');
    submitButton.trigger('click');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });

  it('should change "isLoading" value to true', function () {
    wrapper.vm.$options.watch.loading.call(wrapper.vm, true);
    expect(wrapper.vm.isLoading).toBeTruthy();
  });

  it('should change "show" value to true', function () {
    wrapper.vm.$options.watch.show.call(wrapper.vm, true);
    expect(wrapper.vm.showModal).toBeTruthy();
  });
});
