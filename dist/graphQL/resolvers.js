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
const user_models_1 = require("../models/user.models");
const group_models_1 = require("../models/group.models");
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
const resolvers = {
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
    },
    Mutation: {
        createUser(_, { userDetails }) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log( 
                //     userDetails.username,
                //     userDetails.email,
                //     userDetails.password,
                //     userDetails.events
                // )
                const newUser = new user_models_1.Users({ username: userDetails.username, email: userDetails.email, password: userDetails.password, balance: 0 });
                yield newUser.save();
                // return {
                //     id: newUser._id.toString(),
                //     username: newUser.username,
                //     email: newUser.email,
                //     password: newUser.password,
                //     balance: newUser.balance,
                //     events: []
                // };
                return Object.assign(Object.assign({}, newUser), { id: newUser._id.toString(), events: [] });
            });
        },
        createGroup(_, { groupDetails }) {
            return __awaiter(this, void 0, void 0, function* () {
                const newGrp = new group_models_1.Groups({ admin: groupDetails === null || groupDetails === void 0 ? void 0 : groupDetails.admin, users: groupDetails === null || groupDetails === void 0 ? void 0 : groupDetails.users });
                yield newGrp.save();
                const grpId = newGrp._id.toString();
                // in this you will get the original details - _id, users,admin, along with their details also
                const groupUsersAdmin = yield group_models_1.Groups.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "users",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $unwind: {
                            path: "$userDetails",
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "admin",
                            foreignField: "_id",
                            as: "adminDetails"
                        }
                    },
                    {
                        $unwind: {
                            path: "$adminDetails"
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            users: { $push: "$userDetails" },
                            admin: { $first: "$adminDetails" }
                        }
                    }
                ]);
                console.log(groupUsersAdmin[0].users, "group users admin"); // NOTE: this is an array always
                console.log(groupUsersAdmin[0].users[0], "group user"); // NOTE: this is an array always
                const users = groupUsersAdmin[0].users.map((user) => {
                    return Object.assign(Object.assign({}, user), { id: user._id.toString() });
                });
                const admin = Object.assign(Object.assign({}, groupUsersAdmin[0].admin), { id: groupUsersAdmin[0].admin._id.toString() });
                return { id: grpId, users, admin };
            });
        }
    }
};
exports.default = resolvers;
