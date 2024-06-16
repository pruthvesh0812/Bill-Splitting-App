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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoConfig_1 = require("./models/mongoConfig");
const dotenv_1 = __importDefault(require("dotenv"));
const graphqlConfig_1 = require("./graphQL/graphqlConfig");
// import { expressMiddleware } from '@apollo/server/dist/esm/express4'; // not working
const { expressMiddleware } = require('@apollo/server/express4');
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json());
dotenv_1.default.config();
const PORT = process.env.PORT;
//connects mongoDB
(0, mongoConfig_1.mongoConnect)();
//starts graphql server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield graphqlConfig_1.graphQLServer.start();
    // After the server is started, you can use expressMiddleware
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), expressMiddleware(graphqlConfig_1.graphQLServer));
    app.listen(PORT, () => {
        console.log("WS server running on http://localhost:5000");
        console.log("GraphQL server running on http://localhost:5000/graphql");
    });
});
startServer();
