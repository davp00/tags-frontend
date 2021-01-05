import gql from 'graphql-tag';

export const UPDATE_TAG_LIST_SUBSCRIPTION = gql`
  subscription {
    updateTagList {
      action
      tag {
        id
        pid
        name
        color
      }
    }
  }
`;
