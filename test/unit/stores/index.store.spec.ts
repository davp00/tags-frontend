import {
  state,
  mutations,
  actions,
  subscriptionListActions,
} from '~/store/opts';
import { ActionTypes, MutationTypes } from '~/definitions/index.store';
import { testTag } from '~/test/mocks';
import { Tag } from '~/definitions/tag';
import apolloClient from '~/util/apollo.client';
import { UPDATE_TAG_LIST_SUBSCRIPTION } from '~/gql/subscriptions';
import { DELETE_TAG_MUTATION } from '~/gql/mutations';

const commit = jest.fn();

jest.spyOn(apolloClient, 'mutate');
jest.spyOn(apolloClient, 'subscribe');

describe('Index.store', () => {
  const testState = state();
  const tag: Tag = {
    name: 'TEST_TAG2',
    pid: 112,
    id: 'testIdTag2',
    color: '#ffffff',
  };

  const nTag = { ...tag, name: 'TEST_EDIT' };

  describe('Mutations', () => {
    it('should add a tag', function () {
      mutations[MutationTypes.ADD_TAG](testState, testTag);
      expect(testState.tags.length).toEqual(1);
      expect(testState.tags.indexOf(testTag)).not.toEqual(-1);
    });

    it('should add multiple tags', function () {
      const currentLength = testState.tags.length;
      mutations[MutationTypes.ADD_TAGS](testState, [tag]);
      expect(testState.tags.length).toEqual(currentLength + 1);
    });

    it('should edit a tag', function () {
      mutations[MutationTypes.EDIT_TAG](testState, nTag);

      const editedTag = testState.tags.find((tagI) => tagI.pid === nTag.pid);

      expect(editedTag).toEqual(nTag);
    });

    it('should delete a tag', function () {
      mutations[MutationTypes.DELETE_TAG](testState, nTag);
      const foundTag = testState.tags.find((tagI) => tagI.pid === nTag.pid);

      expect(foundTag).not.toBeDefined();
    });

    it('should increase the page', function () {
      const toIncrease = 1;
      const currentPage = testState.page;

      mutations[MutationTypes.UPDATE_PAGE](testState, toIncrease);

      expect(testState.page).toEqual(currentPage + toIncrease);
    });

    it('should toggle modal state', function () {
      const currentModalState = testState.modal;

      mutations[MutationTypes.TOGGLE_MODAL](testState);

      expect(testState.modal).toEqual(!currentModalState);
    });

    it('should set tag to edit', function () {
      mutations[MutationTypes.SET_TAG_TO_EDIT](testState, nTag);

      expect(testState.tag).toBe(nTag);
    });

    it('should no edit on tag not found', function () {
      const tagToEdit = { ...nTag, pid: 145, name: 'NEW_TAG_NAME' };

      mutations[MutationTypes.EDIT_TAG](testState, tagToEdit);

      const tagFound = testState.tags.find(
        (tagI) => tagI.name === tagToEdit.name
      );

      expect(tagFound).not.toBeDefined();
    });

    it('should no delete on tag not found', function () {
      const tagToEdit = { ...nTag, pid: 145 };
      const currentLength = testState.tags.length;

      mutations[MutationTypes.DELETE_TAG](testState, tagToEdit);

      expect(testState.tags.length).toBe(currentLength);
    });
  });

  describe('Actions', () => {
    it('should add tags to state', function () {
      actions[ActionTypes.SET_TAG_LIST]({ commit } as any, []);

      expect(commit).toBeCalledWith(MutationTypes.UPDATE_PAGE, 1);
      expect(commit).lastCalledWith(MutationTypes.ADD_TAGS, []);
      expect(commit.mock.calls.length).toEqual(2);
    });

    it('should toggle modal', function () {
      actions[ActionTypes.TOGGLE_MODAL]({ commit } as any, nTag);

      expect(commit).toBeCalledWith(MutationTypes.TOGGLE_MODAL, undefined);
      expect(commit).lastCalledWith(MutationTypes.SET_TAG_TO_EDIT, nTag);
    });

    describe('Subscription Actions', function () {
      it('should add item to tag list on new action', function () {
        const data = {
          updateTagList: {
            action: 'ADD',
            tag: nTag,
          },
        };

        subscriptionListActions.onSubscriptionNext({ data }, commit);

        expect(commit).lastCalledWith(MutationTypes.ADD_TAG, nTag);
      });

      it('should edit item of tag list on new action', function () {
        const data = {
          updateTagList: {
            action: 'EDIT',
            tag: nTag,
          },
        };

        subscriptionListActions.onSubscriptionNext({ data }, commit);

        expect(commit).lastCalledWith(MutationTypes.EDIT_TAG, nTag);
      });

      it('should delete item of tag list on new action', function () {
        const data = {
          updateTagList: {
            action: 'DELETE',
            tag: nTag,
          },
        };

        subscriptionListActions.onSubscriptionNext({ data }, commit);

        expect(commit).lastCalledWith(MutationTypes.DELETE_TAG, nTag);
      });

      it('should do nothing with no data on subscription next', function () {
        commit.mockClear();
        const data = {};

        subscriptionListActions.onSubscriptionNext({ data }, commit);

        expect(commit).toHaveBeenCalledTimes(0);
      });

      it('should do nothing with on action not switched', function () {
        commit.mockClear();
        const data = {
          updateTagList: {
            action: 'ACTION',
            tag: nTag,
          },
        };

        subscriptionListActions.onSubscriptionNext({ data }, commit);

        expect(commit).toHaveBeenCalledTimes(0);
      });

      it('should alert error on subscription error', function () {
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        subscriptionListActions.onSubscriptionError();
        expect(window.alert).toHaveBeenCalled();
      });

      it('should subscribe to events', function () {
        actions[ActionTypes.WATCH_TAG_EVENTS]({ commit } as any);

        expect(apolloClient.subscribe).lastCalledWith({
          query: UPDATE_TAG_LIST_SUBSCRIPTION,
        });
      });

      it('should call delete tag mutation', function () {
        actions[ActionTypes.DELETE_TAG]({ commit } as any, nTag);

        expect(apolloClient.mutate).lastCalledWith({
          mutation: DELETE_TAG_MUTATION,
          variables: {
            id: nTag.id,
          },
        });
      });
    });
  });
});
