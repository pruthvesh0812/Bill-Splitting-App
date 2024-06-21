
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models"
import { filter, pipe } from "graphql-yoga";


export const subscriptionResolvers:Resolvers = {
    Subscription:{
        GroupCreated: {
            subscribe: (_,args,{dataSources}) => pipe(
                        dataSources.pubsub.subscribe('GROUP_CREATED'),                       
                            // only sending ws message to those users who are invited by admin
                            filter((payload)=> payload.GroupCreated.users.some((user:User) => user.id == args.id))
                                    // client checking his id is present in those invited
                            )

                            // above approach is not efficient when there are many users and only one server
                            // for any group created .. the server will be doing calculations for each user in FCFS manner
                            
        },

        EventCreated:{
            subscribe: (_,args,{dataSources}) => dataSources.pubsub.subscribe(`${args.groupId!}-event`)   
        },

        CheckNewGroupUsers:{
            subscribe:(_,args,{dataSources}) => dataSources.pubsub.subscribe(`${args.groupId!}-newuser`)   
        },
        CheckNewEventpUsers:{
            subscribe:(_,args,{dataSources}) => dataSources.pubsub.subscribe(`${args.eventId!}-newuser`)   
        },
        }
    }   


