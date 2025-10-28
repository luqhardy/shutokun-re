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
    userId
    progress
    points
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
      userId
      progress
      points
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
export const userProgressByUserId = /* GraphQL */ `query UserProgressByUserId(
  $userId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelUserProgressFilterInput
  $limit: Int
  $nextToken: String
) {
  userProgressByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      progress
      points
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
  APITypes.UserProgressByUserIdQueryVariables,
  APITypes.UserProgressByUserIdQuery
>;
