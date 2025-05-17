/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      message
      sender
      timestamp
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        message
        sender
        timestamp
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserPreference = /* GraphQL */ `
  query GetUserPreference($id: ID!) {
    getUserPreference(id: $id) {
      id
      language
      theme
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUserPreferences = /* GraphQL */ `
  query ListUserPreferences(
    $filter: ModelUserPreferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        language
        theme
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
