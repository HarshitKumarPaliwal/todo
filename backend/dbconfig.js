import "dotenv/config";
import { MongoClient } from "mongodb";
const url = process.env.MONGO_URI;
const database = "node-Project";
export const collectionName = "to-do";

const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  // Yahan 'node-Project' ki jagah string ya upar wala 'database' variable use hoga
  return connect.db(database);
};
