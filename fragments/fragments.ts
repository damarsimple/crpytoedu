import { gql } from "@apollo/client";

export const CoreUserInfoMinimalField = gql`
  fragment CoreUserInfoMinimalField on User {
    id
    name
    username
    roles
    cover {
      id
      path
    }
  }
`;

export const CorePageInfoField = gql`
  fragment CorePageInfoField on PageInfo {
    endCursor
    currentPage
    count
    hasNextPage
    total
  }
`;
