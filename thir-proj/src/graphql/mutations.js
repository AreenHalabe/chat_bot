/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
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
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
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
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
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
export const createUserPreference = /* GraphQL */ `
  mutation CreateUserPreference(
    $input: CreateUserPreferenceInput!
    $condition: ModelUserPreferenceConditionInput
  ) {
    createUserPreference(input: $input, condition: $condition) {
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
export const updateUserPreference = /* GraphQL */ `
  mutation UpdateUserPreference(
    $input: UpdateUserPreferenceInput!
    $condition: ModelUserPreferenceConditionInput
  ) {
    updateUserPreference(input: $input, condition: $condition) {
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
export const deleteUserPreference = /* GraphQL */ `
  mutation DeleteUserPreference(
    $input: DeleteUserPreferenceInput!
    $condition: ModelUserPreferenceConditionInput
  ) {
    deleteUserPreference(input: $input, condition: $condition) {
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
