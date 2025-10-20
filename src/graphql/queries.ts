/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProgress = /* GraphQL */ `query GetUserProgress($id: ID!) {
  getUserProgress(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserProgressQueryVariables,
  APITypes.GetUserProgressQuery
>;
export const listUserProgresses = /* GraphQL */ `query ListUserProgresses(
  $filter: ModelUserProgressFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProgresses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProgressesQueryVariables,
  APITypes.ListUserProgressesQuery
>;
