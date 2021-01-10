import gql from 'graphql-tag';

export const TAG_LIST_QUERY_LIMIT = 10000;

export const TAG_LIST_QUERY = gql`
  query TagList($pagination: PaginationOptions!) {
    tagList(pagination: $pagination) {
      total
      tags {
        id
        pid
        name
        color
      }
    }
  }
`;
