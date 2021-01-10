import { Tag } from '~/definitions/tag';
import { state } from '~/store/opts';

export const $store = {
  state: state(),
  dispatch: jest.fn(),
};

export const $apolloProvider = {
  defaultClient: {
    mutate: jest.fn(() => {
      return { data: {} };
    }),
    query: jest.fn(),
    subscribe: jest.fn(),
  },
};

export const testTag: Tag = {
  name: 'TEST',
  color: '#ffffff',
  pid: 123,
  id: 'TestId',
};
