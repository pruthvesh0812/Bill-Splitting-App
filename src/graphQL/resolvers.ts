
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./types/graphql-types";
import { DataSourceContext } from "./types/context";
import { Groups } from "../models/group.models";
import { mutationResolvers } from "./mutations/index.mutations";
import { subscriptionResolvers } from "./subscriptions/subscriptionsResolver";
import { queryResolvers } from "./queries/queryResolvers";

// import {PubSub, withFilter}  from "graphql-subscriptions"


const resolvers: Resolvers = {
    Query: queryResolvers.Query,
    Mutation: mutationResolvers.Mutation,
    Subscription: subscriptionResolvers.Subscription
}

export default resolvers;