
import { Users } from "../../models/user.models";
import { Resolvers } from "../types/graphql-types";
import { Events } from "../../models/event.models";
import { Messages } from "../../models/message.models";

export const eventMutationResolvers: Resolvers = {
    Mutation: {
        postEvent: async (_, { event }, { dataSources }) => {
            // input EventInput {
            //     eventName: String!
            //     date: String!
            //     totalAmount: Float!
            //     status: EventStatus!
            //     GroupId:ID!
            //   }

            const newEvent = new Events({
                eventName: event?.eventName,
                date: event?.date,
                totalAmount: event?.totalAmount,
                status: event?.status,
                groupId: event?.GroupId
            })

            await newEvent.save();

            const groupId = event?.GroupId
            dataSources.pubsub.publish(`${groupId!}-event`, {
                eventName: event?.eventName,
                date: event?.date,
                totalAmount: event?.totalAmount,
                status: event?.status,
                groupId: event?.GroupId
            })

            return {
                id: newEvent._id.toString(),
                eventName: event?.eventName!,
                date: event?.date!,
                totalAmount: event?.totalAmount!,
                status: event?.status!,
                paidByUser: [],
                groupId: event?.GroupId!
            }

        },

        joinEvent: async (_, { userEventInput }, { dataSources }) => {

            const userId = userEventInput?.userId;
            const eventId = userEventInput?.eventId
            const username = userEventInput?.username
            const eventName = userEventInput?.eventName
            const updatedGrp = await Users.findByIdAndUpdate(userId, { $push: { events: eventId } }, { new: true })// this is basically like doing Users.events.push(eventId)

            dataSources.pubsub.publish(`${eventId}-newuser`, {
                UserJoined: {
                    id: userId,
                    username,
                    eventName
                }
            })

            const event = await Events.findOne({ _id: eventId })


            return {
                id: event?._id.toString()!,
                date: event?.date!,
                eventName: event?.eventName!,
                paidByUser: [],
                status: event?.status!,
                totalAmount: event?.totalAmount!
            }


        },

        eventMessages: async (_, { message }, { dataSources }) => {
            // input messageInput{
            //     eventId:ID!
            //     content:String!
            //     timestamp:String!
            //     sentBy:ID!
            //   }

            const newMessage = new Messages({
                content: message?.content,
                timestamp: message?.timestamp,
                sentBy: message?.sentBy,
                readBy: []
            })
            await newMessage.save()

            const eventId = message?.eventId!;
            const EventMessagesUpdated = await Events.findByIdAndUpdate(eventId, { $push: { messages: newMessage } }, { new: true })

            const allEventMessages = EventMessagesUpdated?.messages;

            const allMessages = allEventMessages?.map(msg => {
                return {
                    eventId,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    sentBy: msg.sentBy.toString(),
                    readBy: msg.readBy.map(id => id.toString())
                }
            })

            dataSources.pubsub.publish(`${eventId}-newmessage`, {
                eventId: eventId.toString()!,
                allMessages: allMessages!
            })

            return {
                eventId: eventId.toString()!,
                allMessages: allMessages!
            }
        }

    }
}

