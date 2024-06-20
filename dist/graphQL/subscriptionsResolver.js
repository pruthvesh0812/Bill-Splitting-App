"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
const subscriptionResolvers = {
    Subscription: {
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
};
