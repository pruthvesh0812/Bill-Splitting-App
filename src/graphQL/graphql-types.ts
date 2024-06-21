import { GraphQLResolveInfo } from 'graphql';
import { DataSourceContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Event = {
  __typename?: 'Event';
  date: Scalars['String']['output'];
  eventName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  paidByUser: Array<Maybe<User>>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type EventInput = {
  GroupId: Scalars['ID']['input'];
  date: Scalars['String']['input'];
  eventName: Scalars['String']['input'];
  status: Scalars['String']['input'];
  totalAmount: Scalars['Float']['input'];
};

export enum EventStatus {
  Close = 'CLOSE',
  Open = 'OPEN'
}

export type Group = {
  __typename?: 'Group';
  admin?: Maybe<User>;
  groupName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGroup: Group;
  createUser: User;
  joinEvent?: Maybe<Event>;
  joinGroup?: Maybe<Group>;
  onPayment?: Maybe<User>;
  postEvent: Event;
};


export type MutationCreateGroupArgs = {
  groupDetails?: InputMaybe<CreateGrpInput>;
};


export type MutationCreateUserArgs = {
  userDetails: CreateUserInput;
};


export type MutationJoinEventArgs = {
  userEventInput?: InputMaybe<UserEventInput>;
};


export type MutationJoinGroupArgs = {
  user: UserInput;
};


export type MutationOnPaymentArgs = {
  payment?: InputMaybe<PaymentInput>;
};


export type MutationPostEventArgs = {
  event?: InputMaybe<EventInput>;
};

export type Query = {
  __typename?: 'Query';
  getParticipatedEvents?: Maybe<Array<Event>>;
  getUserById: User;
  getUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetParticipatedEventsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  CheckNewEventpUsers?: Maybe<UserJoined>;
  CheckNewGroupUsers?: Maybe<UserJoined>;
  EventCreated?: Maybe<Event>;
  GroupCreated?: Maybe<Group>;
};


export type SubscriptionCheckNewEventpUsersArgs = {
  eventId: Scalars['ID']['input'];
};


export type SubscriptionCheckNewGroupUsersArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionEventCreatedArgs = {
  groupId: Scalars['ID']['input'];
};


export type SubscriptionGroupCreatedArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  balance?: Maybe<Scalars['Float']['output']>;
  email: Scalars['String']['output'];
  events: Array<Event>;
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserInput = {
  groupId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
};

export type UserJoined = {
  __typename?: 'UserJoined';
  id: Scalars['ID']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type CreateGrpInput = {
  admin: Scalars['ID']['input'];
  groupName: Scalars['String']['input'];
  users: Array<Scalars['ID']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  events?: InputMaybe<EventInput>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type PaymentInput = {
  amount: Scalars['Float']['input'];
  event?: InputMaybe<EventInput>;
  user: UserInput;
};

export type UserEventInput = {
  eventId: Scalars['ID']['input'];
  eventName: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
  username: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Event: ResolverTypeWrapper<Event>;
  EventInput: EventInput;
  EventStatus: EventStatus;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Group: ResolverTypeWrapper<Group>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserJoined: ResolverTypeWrapper<UserJoined>;
  createGrpInput: CreateGrpInput;
  createUserInput: CreateUserInput;
  paymentInput: PaymentInput;
  userEventInput: UserEventInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Event: Event;
  EventInput: EventInput;
  Float: Scalars['Float']['output'];
  Group: Group;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
  UserInput: UserInput;
  UserJoined: UserJoined;
  createGrpInput: CreateGrpInput;
  createUserInput: CreateUserInput;
  paymentInput: PaymentInput;
  userEventInput: UserEventInput;
};

export type EventResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paidByUser?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  admin?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  groupName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, Partial<MutationCreateGroupArgs>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'userDetails'>>;
  joinEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, Partial<MutationJoinEventArgs>>;
  joinGroup?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<MutationJoinGroupArgs, 'user'>>;
  onPayment?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationOnPaymentArgs>>;
  postEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, Partial<MutationPostEventArgs>>;
};

export type QueryResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getParticipatedEvents?: Resolver<Maybe<Array<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryGetParticipatedEventsArgs, 'id'>>;
  getUserById?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'username'>>;
  getUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  CheckNewEventpUsers?: SubscriptionResolver<Maybe<ResolversTypes['UserJoined']>, "CheckNewEventpUsers", ParentType, ContextType, RequireFields<SubscriptionCheckNewEventpUsersArgs, 'eventId'>>;
  CheckNewGroupUsers?: SubscriptionResolver<Maybe<ResolversTypes['UserJoined']>, "CheckNewGroupUsers", ParentType, ContextType, RequireFields<SubscriptionCheckNewGroupUsersArgs, 'groupId'>>;
  EventCreated?: SubscriptionResolver<Maybe<ResolversTypes['Event']>, "EventCreated", ParentType, ContextType, RequireFields<SubscriptionEventCreatedArgs, 'groupId'>>;
  GroupCreated?: SubscriptionResolver<Maybe<ResolversTypes['Group']>, "GroupCreated", ParentType, ContextType, RequireFields<SubscriptionGroupCreatedArgs, 'id'>>;
};

export type UserResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  balance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserJoinedResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['UserJoined'] = ResolversParentTypes['UserJoined']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = DataSourceContext> = {
  Event?: EventResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserJoined?: UserJoinedResolvers<ContextType>;
};

