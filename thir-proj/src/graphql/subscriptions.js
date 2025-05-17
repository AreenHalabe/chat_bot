/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onCreateConversation(filter: $filter, owner: $owner) {
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
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onUpdateConversation(filter: $filter, owner: $owner) {
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
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onDeleteConversation(filter: $filter, owner: $owner) {
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
export const onCreateUserPreference = /* GraphQL */ `
  subscription OnCreateUserPreference(
    $filter: ModelSubscriptionUserPreferenceFilterInput
    $owner: String
  ) {
    onCreateUserPreference(filter: $filter, owner: $owner) {
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
export const onUpdateUserPreference = /* GraphQL */ `
  subscription OnUpdateUserPreference(
    $filter: ModelSubscriptionUserPreferenceFilterInput
    $owner: String
  ) {
    onUpdateUserPreference(filter: $filter, owner: $owner) {
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
export const onDeleteUserPreference = /* GraphQL */ `
  subscription OnDeleteUserPreference(
    $filter: ModelSubscriptionUserPreferenceFilterInput
    $owner: String
  ) {
    onDeleteUserPreference(filter: $filter, owner: $owner) {
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
