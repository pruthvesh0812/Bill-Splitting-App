"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryResolvers = void 0;
const user_models_1 = require("../models/user.models");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub = new graphql_subscriptions_1.PubSub();
exports.queryResolvers = {
    Query: {
        getUsers() {
            return __awaiter(this, void 0, void 0, function* () {
                const allUsers = yield user_models_1.Users.aggregate([
                    // first pipeline to do left join between Users and Events
                    {
                        $lookup: {
                            from: "events",
                            localField: "events",
                            foreignField: "_id",
                            as: "events"
                        }
                    } // this wil give me an array of events
                    ,
                    // this next pipeline is to destructure the array of events to get details of each array elements
                    {
                        $unwind: {
                            path: "$events",
                            preserveNullAndEmptyArrays: true
                        } //           Literal values: When you're specifying literal values (like strings, numbers, or booleans) in the pipeline, you don't need to use the $ sign. For example,  true, null, etc.
                    }
                ]);
                console.log(allUsers);
                // you have to have a mapper function
                // 1. to get id, since mongo gives you _id
                // 2. to have types proper .. because of -> getUser(): User!
                const allUsersMapped = allUsers.map((user) => {
                    return {
                        id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        password: user.password,
                        balance: user.balance,
                        events: []
                    };
                });
                return allUsersMapped;
            });
        },
        getUserById(_, { username }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield user_models_1.Users.aggregate([
                    // match the user with username
                    {
                        $match: {
                            username: username
                        }
                    },
                    {
                        $lookup: {
                            from: "events",
                            localField: "events",
                            foreignField: "_id",
                            as: "events"
                        }
                    },
                    {
                        $unwind: {
                            path: "$events",
                            preserveNullAndEmptyArrays: true // if any element is empty or null it will be preserved not discarded
                        }
                    }
                ]);
                // const user = allUsers.filter((user)=> user.username == username)
                const userMapped = {
                    id: user[0]._id.toString(),
                    username: user[0].username,
                    email: user[0].email,
                    password: user[0].password,
                    balance: user[0].balance,
                    events: (_a = user[0].events) !== null && _a !== void 0 ? _a : [] // coalescing operation, return first non-null value
                };
                return userMapped;
            });
        }
    }
};
