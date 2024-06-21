
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models";
import { mutationResolvers } from "./mutations/mutationsResolver";
import { subscriptionResolvers } from "./subscriptionsResolver";
import { queryResolvers } from "./queryResolvers";

// import {PubSub, withFilter}  from "graphql-subscriptions"


const resolvers: Resolvers = {
    Query: queryResolvers.Query,
    Mutation: mutationResolvers.Mutation,
    Subscription: subscriptionResolvers.Subscription
}

export default resolvers;