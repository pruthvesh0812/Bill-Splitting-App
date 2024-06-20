
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models"

import {PubSub}  from "graphql-subscriptions"

const pubsub = new PubSub();

export const queryResolvers:Resolvers = {
    Query:{
        async getUsers(){
                const allUsers = await Users.aggregate([
                    // first pipeline to do left join between Users and Events
                    {
                        $lookup:{
                            from:"events",
                            localField:"events",
                            foreignField:"_id",
                            as : "events"
                        }
                    } // this wil give me an array of events
                    ,
                    // this next pipeline is to destructure the array of events to get details of each array elements
                    {
                        $unwind:{
                            path:"$events", //           In MongoDB's aggregation pipeline, the dollar sign ($) is used to access and manipulate fields in documents, as well as to denote operators and stages in the pipeline.
                            preserveNullAndEmptyArrays: true
                        }                  //           Literal values: When you're specifying literal values (like strings, numbers, or booleans) in the pipeline, you don't need to use the $ sign. For example,  true, null, etc.
                    }
                ])
                
                console.log(allUsers)
                // you have to have a mapper function
                // 1. to get id, since mongo gives you _id
                // 2. to have types proper .. because of -> getUser(): User!
                const allUsersMapped = allUsers.map((user)=>{
                    return {                          
                                    id: user._id.toString(),
                                    username: user.username,
                                    email: user.email,
                                    password: user.password,
                                    balance: user.balance,
                                    events: []                              
                            }
                })

                return allUsersMapped
        },
        async getUserById(_,{username}):Promise<User>{
            const user = await Users.aggregate([
                // match the user with username
                {
                    $match:{
                        username:username
                    }
                },
                {
                    $lookup:{
                        from:"events",
                        localField:"events",
                        foreignField:"_id",
                        as: "events"
                    }
                },
                {
                    $unwind:{
                        path:"$events", // from as: "events" - this document hold our array which we are unwinding
                        preserveNullAndEmptyArrays:true // if any element is empty or null it will be preserved not discarded
                    }
                }
            ])
            // const user = allUsers.filter((user)=> user.username == username)
            const userMapped = {
                id: user[0]._id.toString(),
                username: user[0].username,
                email: user[0].email,
                password: user[0].password,
                balance: user[0].balance,
                events: user[0].events ?? []  // coalescing operation, return first non-null value
            }
            return userMapped
        }
    }
}