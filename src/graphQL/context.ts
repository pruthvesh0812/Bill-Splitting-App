import { Connection } from "mongoose";
import mongoose from "mongoose";
import { createPubSub } from "graphql-yoga";

const pubsub = createPubSub();

export type DataSourceContext = {
  dataSources: {
    pubsub:typeof pubsub
  };
};