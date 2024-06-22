
import { Resolvers, User } from "../types/graphql-types";
import { userMutationResolvers } from "./user.mutation";
import { groupMutationResolvers } from "./group.mutation";
import { eventMutationResolvers } from "./event.mutation";

export const mutationResolvers: Resolvers = {
    Mutation: {
        createUser: userMutationResolvers?.Mutation?.createUser,

        createGroup: groupMutationResolvers?.Mutation?.createGroup,

        postEvent: eventMutationResolvers?.Mutation?.postEvent,

        joinEvent: eventMutationResolvers?.Mutation?.joinEvent,

        eventMessages: eventMutationResolvers?.Mutation?.eventMessages

    }
}

