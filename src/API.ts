/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserProgressInput = {
  id?: string | null,
  term: string,
  definition: string,
  level: string,
  srs_level: number,
  next_review_timestamp: number,
};

export type ModelUserProgressConditionInput = {
  term?: ModelStringInput | null,
  definition?: ModelStringInput | null,
  level?: ModelStringInput | null,
  srs_level?: ModelIntInput | null,
  next_review_timestamp?: ModelIntInput | null,
  and?: Array< ModelUserProgressConditionInput | null > | null,
  or?: Array< ModelUserProgressConditionInput | null > | null,
  not?: ModelUserProgressConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UserProgress = {
  __typename: "UserProgress",
  id: string,
  term: string,
  definition: string,
  level: string,
  srs_level: number,
  next_review_timestamp: number,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateUserProgressInput = {
  id: string,
  term?: string | null,
  definition?: string | null,
  level?: string | null,
  srs_level?: number | null,
  next_review_timestamp?: number | null,
};

export type DeleteUserProgressInput = {
  id: string,
};

export type ModelUserProgressFilterInput = {
  id?: ModelIDInput | null,
  term?: ModelStringInput | null,
  definition?: ModelStringInput | null,
  level?: ModelStringInput | null,
  srs_level?: ModelIntInput | null,
  next_review_timestamp?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProgressFilterInput | null > | null,
  or?: Array< ModelUserProgressFilterInput | null > | null,
  not?: ModelUserProgressFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelUserProgressConnection = {
  __typename: "ModelUserProgressConnection",
  items:  Array<UserProgress | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionUserProgressFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  term?: ModelSubscriptionStringInput | null,
  definition?: ModelSubscriptionStringInput | null,
  level?: ModelSubscriptionStringInput | null,
  srs_level?: ModelSubscriptionIntInput | null,
  next_review_timestamp?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserProgressFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserProgressFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateUserProgressMutationVariables = {
  input: CreateUserProgressInput,
  condition?: ModelUserProgressConditionInput | null,
};

export type CreateUserProgressMutation = {
  createUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserProgressMutationVariables = {
  input: UpdateUserProgressInput,
  condition?: ModelUserProgressConditionInput | null,
};

export type UpdateUserProgressMutation = {
  updateUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserProgressMutationVariables = {
  input: DeleteUserProgressInput,
  condition?: ModelUserProgressConditionInput | null,
};

export type DeleteUserProgressMutation = {
  deleteUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetUserProgressQueryVariables = {
  id: string,
};

export type GetUserProgressQuery = {
  getUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserProgressesQueryVariables = {
  filter?: ModelUserProgressFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProgressesQuery = {
  listUserProgresses?:  {
    __typename: "ModelUserProgressConnection",
    items:  Array< {
      __typename: "UserProgress",
      id: string,
      term: string,
      definition: string,
      level: string,
      srs_level: number,
      next_review_timestamp: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserProgressSubscriptionVariables = {
  filter?: ModelSubscriptionUserProgressFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProgressSubscription = {
  onCreateUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserProgressSubscriptionVariables = {
  filter?: ModelSubscriptionUserProgressFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProgressSubscription = {
  onUpdateUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserProgressSubscriptionVariables = {
  filter?: ModelSubscriptionUserProgressFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProgressSubscription = {
  onDeleteUserProgress?:  {
    __typename: "UserProgress",
    id: string,
    term: string,
    definition: string,
    level: string,
    srs_level: number,
    next_review_timestamp: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
