
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../../models/user.models";
import { Resolvers, User } from "../graphql-types";
import { DataSourceContext } from "../context";
import { Groups } from "../../models/group.models"
import { Events } from "../../models/event.models";



export const mutationResolvers: Resolvers = {
    Mutation: {
        async createUser(_, { userDetails }) {

            // console.log( 
            //     userDetails.username,
            //     userDetails.email,
            //     userDetails.password,
            //     userDetails.events
            // )

            const newUser = new Users({ username: userDetails.username, email: userDetails.email, password: userDetails.password, balance: 0 })
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

        async createGroup(_, { groupDetails }, { dataSources }) {
            // creating a potential group by sending a group invite and init group admin and groupId

            // const newGrp = new Groups({ admin: groupDetails?.admin, users: groupDetails?.users })
            const newGrp = new Groups({ admin: groupDetails?.admin, users: [] , groupName:groupDetails?.groupName})
            
            await newGrp.save()

            const grpId = newGrp._id.toString();
            
            // in this you will get the original details - _id, users,admin, along with their details also
            // const groupUsersAdmin: {
            //     _id: String,
            //     users: any[],
            //     admin: any
            // }[] = await Groups.aggregate([

            //     {
            //         $lookup: {
            //             from: "users",
            //             localField: "users",
            //             foreignField: "_id",
            //             as: "userDetails"
            //         }
            //     },

            //     {
            //         $unwind: {
            //             path: "$userDetails",
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "users",
            //             localField: "admin",
            //             foreignField: "_id",
            //             as: "adminDetails"
            //         }
            //     },
            //     {
            //         $unwind: {
            //             path: "$adminDetails"
            //         }
            //     }

            //     ,
            //     {
            //         $group: {
            //             _id: "$_id",
            //             users: { $push: "$userDetails" },
            //             admin: { $first: "$adminDetails" }
            //         }
            //     }
            // ])

            // console.log(groupUsersAdmin[0].users, "group users admin")// NOTE: this is an array always
            // console.log(groupUsersAdmin[0].users[0], "group user")// NOTE: this is an array always

            const usersAndAdmin:{
                    users: any[],
                    admin: any
                }[] = await Users.aggregate([
                {
                    $match:{
                        $or:[
                            {_id: groupDetails?.admin},
                            {
                                _id: {
                                    $in: groupDetails?.users
                                }
                            }
                        ] 
                    }
                },
                /*
                Execution order within a stage:
                In a single stage (like $group or $project), the operations are executed from the innermost levels outward. This means that in complex expressions, the deepest nested operations are evaluated first.
                Execution order across stages:
                The stages in an aggregation pipeline are executed sequentially, from top to bottom. Each stage's output becomes the input for the next stage.
                 */
                {
                    $group:{  
                        _id:null , // required                
                        users: { $push: { $cond: [
                            {$ne:["$_id",groupDetails?.admin]}, // my condition , ne- not equal operator ( its like $_id != groupDetails.admin)
                            "$$ROOT",// if true - point to current document
                            null
                        ]}},
                        admin: { $first: { $cond: [
                            {$eq:["$_id", groupDetails?.admin]},
                            "$$ROOT",
                            "$REMOVE" // non-dmin users are are completely removed 
                        ]} }
                    }
                },
                // now to filter out null values
                {
                    $project:{
                        _id:0 ,// remove _id in the final result,
                        users:{
                            $filter:{
                                input:"$users",
                                as:"user", // each users ele is taken as user,
                                cond:{$ne:["$$user",null]}
                            }
                        },
                        admin:1 // take admin value as it is (dont make any change)
                    }
                }
            ])

            const users = usersAndAdmin[0].users.map(user => {
                return { ...user, id: user._id.toString() }
            })

            const admin = { ...usersAndAdmin[0].admin, id: usersAndAdmin[0].admin._id.toString() }
            // publish to pubsub
            dataSources.pubsub.publish('GROUP_CREATED', {
                GroupCreated: { id: grpId, users, admin , groupName:groupDetails?.groupName! }// Group type // NOTE TO HAVE OBJECT ACCORDING TO SCHEMA TYPE
            })

            return { id: grpId, users, admin, groupName:groupDetails?.groupName! }
        },

        postEvent:async (_,{event},{dataSources})=>{
            // input EventInput {
            //     eventName: String!
            //     date: String!
            //     totalAmount: Float!
            //     status: EventStatus!
            //     GroupId:ID!
            //   }

            const newEvent = new Events({
                eventName:event?.eventName,
                date:event?.date,   
                totalAmount:event?.totalAmount,
                status:event?.status,
                groupId:event?.GroupId
            })

            await newEvent.save();

            const groupId = event?.GroupId
            dataSources.pubsub.publish(`${groupId!}-event`,{
                eventName:event?.eventName,
                date:event?.date,   
                totalAmount:event?.totalAmount,
                status:event?.status,
                groupId:event?.GroupId
            })

            return {
                id: newEvent._id.toString(),
                eventName:event?.eventName!,
                date:event?.date!,   
                totalAmount:event?.totalAmount!,
                status:event?.status!,
                paidByUser:[],
                groupId:event?.GroupId!
            }

        },

        joinEvent: async (_,{userEventInput},{ dataSources}) =>{
             
            
           

            const userId = userEventInput?.userId;
            const eventId = userEventInput?.eventId  
            const username =  userEventInput?.username                            
            const eventName =  userEventInput?.eventName                            
            const updatedGrp = await Users.findByIdAndUpdate(userId,{ $push:{events:eventId}},{new:true})// this is basically like doing users.push(userId)
            
            dataSources.pubsub.publish(`${eventId}-newuser`,{
                UserJoined:{
                    id:userId,
                    username,
                    eventName
                }
            })
            
            const event = await Events.findOne({_id:eventId})
            
            
            return { 
                id:event?._id.toString()!,
                date:event?.date!,
                eventName:event?.eventName!,
                paidByUser:[],
                status:event?.status!,
                totalAmount:event?.totalAmount!
            }

            
        },

        joinGroup: async (_,{user},{ dataSources}) =>{
            // input UserInput {
            //     id: ID!
            //     groupId: ID!
            //   }
            
            const groupId = user?.groupId!;
            const userId = user?.id!                                
            const updatedGrp = await Groups.findByIdAndUpdate(groupId,{ $push:{users:userId}},{new:true})// this is basically like doing users.push(userId)
            
            dataSources.pubsub.publish(`${groupId}-newuser`,{
                UserJoined:{
                    id:userId,
                    username:user?.username!
                }
            })
            
            return {
                id:updatedGrp?._id.toString()!,
                groupName:updatedGrp?.groupName!,
                users:[], // not required here
                admin:null
            }
        }

    }
}

