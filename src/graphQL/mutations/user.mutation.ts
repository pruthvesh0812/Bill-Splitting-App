import { Users } from "../../models/user.models";
import { Resolvers } from "../types/graphql-types";

export const userMutationResolvers: Resolvers = {
    Mutation: {
        createUser: async (_, { userDetails }) => {

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

        }
    }
}
