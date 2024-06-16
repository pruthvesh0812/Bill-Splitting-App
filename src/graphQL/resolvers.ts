
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Users } from "../models/user.models";
import { Resolvers, User } from "./graphql-types";
import { DataSourceContext } from "./context";
import { Groups } from "../models/group.models";

// let allUsers = [
//     {
//         id: "sodfjoasdfjo",
//         username: "jigglu",
//         email: "jig@gmail.com",
//         password: "dfaslfdkasdfkj",
//         balance: 6,
//         events: []
//     },
//     {
//         id: "ewerwerasdf",
//         username: "pruthvesh",
//         email: "pruthvesh@gmail.com",
//         password: "asdfasdfae",
//         balance: 3,
//         events: []
//     }
// ]

const resolvers: Resolvers= {
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
    },
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
                // return {
                //     id: newUser._id.toString(),
                //     username: newUser.username,
                //     email: newUser.email,
                //     password: newUser.password,
                //     balance: newUser.balance,
                //     events: []
                // };

                return {...newUser, id:newUser._id.toString(), events:[]}
           
        },

        async createGroup(_,{groupDetails}){
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

            return {id:grpId,users,admin}
        }
    }
}

export default resolvers;