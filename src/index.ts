import express from 'express'
import cors from 'cors'
import { mongoConnect } from './models/mongoConfig';
import dotenv from 'dotenv'
// import { expressMiddleware } from '@apollo/server/dist/esm/express4'; // not working
const { expressMiddleware } = require('@apollo/server/express4');



// for pub-sub model using ws
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
const app = express();

app.use(cors({
    origin:"*"
}))

app.use(express.json())

dotenv.config()

const PORT = process.env.PORT

//creating ws-subscriptions server
export const httpServer = createServer(app)
console.log("alsdkfl")
const wss = new WebSocketServer({
  server:httpServer,
  path:"/graphql"
})
import {schema} from "./graphQL/graphqlConfig"
import { createPubSub } from 'graphql-yoga';
import { DataSourceContext } from './graphQL/context';

const pubsub =createPubSub()
export const serverCleanup = useServer({
  schema,
  context: async (ctx, msg, args): Promise<DataSourceContext> => {
    return {
      dataSources: {
        pubsub: pubsub
      }
    };
  },
},wss)

// because graphQLServer uses serverCleanup and httpServer in its plugin thats why calling 
// this after they are initialized
import { graphQLServer } from './graphQL/graphqlConfig';


//connects mongoDB
mongoConnect() 

//starts graphql server
const startServer = async () => {
    console.log("23423")
    await graphQLServer.start();
    console.log('###')
    // After the server is started, you can use expressMiddleware
    app.use("/graphql", cors(), express.json(), expressMiddleware(graphQLServer, {
      context:()=>{
        return {
          dataSources:{
            pubsub:pubsub
          }
        }
      }
    }));
  
    httpServer.listen(PORT, () => {
      console.log("WS server running on http://localhost:5000");
      console.log("GraphQL server running on http://localhost:5000/graphql");
    });
  };
  
  startServer();