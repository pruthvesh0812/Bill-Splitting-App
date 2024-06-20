
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models";
import { mutationResolvers } from "./mutationsResolver";
// import { subscriptionResolvers } from "./subscriptionsResolver";
import { queryResolvers } from "./queryResolvers";
import { filter, pipe } from "graphql-yoga";
// import {PubSub, withFilter}  from "graphql-subscriptions"


const resolvers: Resolvers= {
    Query:queryResolvers.Query,
    Mutation:{
        async createUser(_,{userDetails}){

           // console.log( 
           //     userDetails.username,
           //     userDetails.email,
           //     userDetails.password,
           //     userDetails.events
           // )
           
               const newUser = new Users({username:userDetails.username,email: userDetails.email,password:userDetails.password,balance:0})
               await newUser.save()
               return {
                   id: newUser._id.toString(),
                   username: newUser.username,
                   email: newUser.email,
                   password: newUser.password,
                   balance: newUser.balance,
                   events: []
               };
               // console.log({...newUser,id:newUser._id.toString(),events:[]})
               // return {...newUser, id:newUser._id.toString(), events:[]}
          
       },
       
       async createGroup(_,{groupDetails},{dataSources}){
           const newGrp = new Groups({admin:groupDetails?.admin,users:groupDetails?.users})
           await newGrp.save()
       
           
          
       
           const grpId = newGrp._id.toString();
           // in this you will get the original details - _id, users,admin, along with their details also
           const groupUsersAdmin:{
               _id: String,
               users:any[],
               admin:any
           }[] = await Groups.aggregate([
               
               {
                   $lookup:{
                       from:"users",
                       localField:"users",
                       foreignField:"_id",
                       as:"userDetails"
                   }
               },
               
               {
                   $unwind:{
                       path:"$userDetails",                       
                   }
               },
               {
                   $lookup:{
                       from:"users",
                       localField:"admin",
                       foreignField:"_id",
                       as:"adminDetails"
                   }
               },
               {
                   $unwind:{
                       path:"$adminDetails"
                   }
               }
               
               ,
               {
                   $group: {
                     _id: "$_id",
                     users:{  $push:"$userDetails"},
                     admin: { $first: "$adminDetails" }
                   }
               }
           ])
       
           console.log(groupUsersAdmin[0].users,"group users admin")// NOTE: this is an array always
           console.log(groupUsersAdmin[0].users[0],"group user")// NOTE: this is an array always
           
           const users = groupUsersAdmin[0].users.map((user)=>{
               return {...user,id:user._id.toString()}
           })
       
           const admin = {...groupUsersAdmin[0].admin,id:groupUsersAdmin[0].admin._id.toString()}
           // publish to pubsub
           dataSources.pubsub.publish('GROUP_CREATED', {
               GroupCreated:{id:grpId,users,admin}// Group type // NOTE TO HAVE OBJECT ACCORDING TO SCHEMA TYPE
           })

           return {id:grpId,users,admin}
       }
       
   },
    Subscription: {
        GroupCreated: {
            subscribe: (_,args,{dataSources}) => pipe(
                        dataSources.pubsub.subscribe('GROUP_CREATED'),                       
                            // only sending ws message to those users who are invited by admin
                            filter((payload)=> payload.GroupCreated.users.some((user:User) => user.id == args.id))
                                    // client checking his id is present in those invited
                            )

                            // above approach is not efficient when there are many users and only one server
                            // for any group created .. the server will be doing calculations for each user in FCFS manner
                            
        }
    }
}

export default resolvers;