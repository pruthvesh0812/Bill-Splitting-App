import { Connection } from "mongoose";
import mongoose from "mongoose";


export type DataSourceContext = {
  dataSources: {
    db: Connection;
  };
};