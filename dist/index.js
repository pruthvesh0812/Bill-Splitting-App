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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverCleanup = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoConfig_1 = require("./models/mongoConfig");
const dotenv_1 = __importDefault(require("dotenv"));
// import { expressMiddleware } from '@apollo/server/dist/esm/express4'; // not working
const { expressMiddleware } = require('@apollo/server/express4');
// for pub-sub model using ws
const http_1 = require("http");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json());
dotenv_1.default.config();
const PORT = process.env.PORT;
//creating ws-subscriptions server
exports.httpServer = (0, http_1.createServer)(app);
console.log("alsdkfl");
const wss = new ws_1.WebSocketServer({
    server: exports.httpServer,
    path: "/graphql"
});
const graphqlConfig_1 = require("./graphQL/graphqlConfig");
const graphql_yoga_1 = require("graphql-yoga");
const pubsub = (0, graphql_yoga_1.createPubSub)();
exports.serverCleanup = (0, ws_2.useServer)({
    schema: graphqlConfig_1.schema,
    context: (ctx, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            dataSources: {
                pubsub: pubsub
            }
        };
    }),
}, wss);
// because graphQLServer uses serverCleanup and httpServer in its plugin thats why calling 
// this after they are initialized
const graphqlConfig_2 = require("./graphQL/graphqlConfig");
//connects mongoDB
(0, mongoConfig_1.mongoConnect)();
//starts graphql server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("23423");
    yield graphqlConfig_2.graphQLServer.start();
    console.log('###');
    // After the server is started, you can use expressMiddleware
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), expressMiddleware(graphqlConfig_2.graphQLServer, {
        context: () => {
            return {
                dataSources: {
                    pubsub: pubsub
                }
            };
        }
    }));
    exports.httpServer.listen(PORT, () => {
        console.log("WS server running on http://localhost:5000");
        console.log("GraphQL server running on http://localhost:5000/graphql");
    });
});
startServer();
