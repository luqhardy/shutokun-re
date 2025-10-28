/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUserProgress = /* GraphQL */ `subscription OnCreateUserProgress(
  $filter: ModelSubscriptionUserProgressFilterInput
  $owner: String
) {
  onCreateUserProgress(filter: $filter, owner: $owner) {
    id
    userId
    progress
    points
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProgressSubscriptionVariables,
  APITypes.OnCreateUserProgressSubscription
>;
export const onUpdateUserProgress = /* GraphQL */ `subscription OnUpdateUserProgress(
  $filter: ModelSubscriptionUserProgressFilterInput
  $owner: String
) {
  onUpdateUserProgress(filter: $filter, owner: $owner) {
    id
    userId
    progress
    points
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProgressSubscriptionVariables,
  APITypes.OnUpdateUserProgressSubscription
>;
export const onDeleteUserProgress = /* GraphQL */ `subscription OnDeleteUserProgress(
  $filter: ModelSubscriptionUserProgressFilterInput
  $owner: String
) {
  onDeleteUserProgress(filter: $filter, owner: $owner) {
    id
    userId
    progress
    points
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProgressSubscriptionVariables,
  APITypes.OnDeleteUserProgressSubscription
>;
