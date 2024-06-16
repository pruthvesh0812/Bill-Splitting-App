import express from 'express'
import cors from 'cors'
import { mongoConnect } from './models/mongoConfig';
import dotenv from 'dotenv'
import { graphQLServer } from './graphQL/graphqlConfig';
// import { expressMiddleware } from '@apollo/server/dist/esm/express4'; // not working
const { expressMiddleware } = require('@apollo/server/express4');


const app = express();

app.use(cors({
    origin:"*"
}))

app.use(express.json())

dotenv.config()

const PORT = process.env.PORT

//connects mongoDB
mongoConnect() 

//starts graphql server
const startServer = async () => {
    await graphQLServer.start();
  
    // After the server is started, you can use expressMiddleware
    app.use("/graphql", cors(), express.json(), expressMiddleware(graphQLServer));
  
    app.listen(PORT, () => {
      console.log("WS server running on http://localhost:5000");
      console.log("GraphQL server running on http://localhost:5000/graphql");
    });
  };
  
  startServer();