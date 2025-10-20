/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUserProgress = /* GraphQL */ `mutation CreateUserProgress(
  $input: CreateUserProgressInput!
  $condition: ModelUserProgressConditionInput
) {
  createUserProgress(input: $input, condition: $condition) {
    id
    term
    definition
    level
    srs_level
    next_review_timestamp
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserProgressMutationVariables,
  APITypes.CreateUserProgressMutation
>;
export const updateUserProgress = /* GraphQL */ `mutation UpdateUserProgress(
  $input: UpdateUserProgressInput!
  $condition: ModelUserProgressConditionInput
) {
  updateUserProgress(input: $input, condition: $condition) {
    id
    term
    definition
    level
    srs_level
    next_review_timestamp
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserProgressMutationVariables,
  APITypes.UpdateUserProgressMutation
>;
export const deleteUserProgress = /* GraphQL */ `mutation DeleteUserProgress(
  $input: DeleteUserProgressInput!
  $condition: ModelUserProgressConditionInput
) {
  deleteUserProgress(input: $input, condition: $condition) {
    id
    term
    definition
    level
    srs_level
    next_review_timestamp
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserProgressMutationVariables,
  APITypes.DeleteUserProgressMutation
>;
