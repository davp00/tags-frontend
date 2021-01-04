import gql from 'graphql-tag';

export const TAG_LIST_QUERY = gql`
  query TagList($pagination: PaginationOptions!) {
    tagList(pagination: $pagination) {
      pages
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
