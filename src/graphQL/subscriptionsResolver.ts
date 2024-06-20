
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models"
import {PubSub, withFilter}  from "graphql-subscriptions"

const pubsub = new PubSub();

 const subscriptionResolvers:Resolvers = {
    Subscription:{
        // GroupCreated: {
        //     subscribe: ()=>({ // workaround for an error if you do it the normal way
        //         [Symbol.asyncIterator]: withFilter(
        //             ()=> pubsub.asyncIterator(['GROUP_CREATED']),
        //             (payload,variables)=>{
                        
        //                 // only sending ws message to those users who are invited by admin
        //                 const response =  (payload.GroupCreated.users.map((user:User):boolean | undefined => {
        //                     if(user.id == variables.id){ // client checking his id is present in those invited
        //                         return true;
        //                     }
        //                 }))[0]
    
        //                 // above approach is not efficient when there are many users and only one server
        //                 // for any group created .. the server will be doing calculations for each user in FCFS manner
        //                 console.log(response,"response")
        //                 return response
        //             }
        //     )
        //     })
        // }
    }   
}

