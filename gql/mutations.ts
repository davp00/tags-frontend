import gql from 'graphql-tag';

export const CREATE_TAG_MUTATION = gql`
  mutation InsertTag($name: String!) {
    createTag(name: $name)
  }
`;

export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id)
  }
`;
