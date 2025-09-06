import dotenv from "dotenv";
dotenv.config();

//Responsible for creating and exporting a shared MongoDB connection

import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

let client: MongoClient | null = null;
let db: Db | null = null;

//connectToDB - establishes a connection.
export async function connectToDB(): Promise<void> {
  if (db && client) {
    //already connected
    return;
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();

  db = client.db(DB_NAME);

  console.log(`✅MongoDB connected successfully`);
}

//getCollection - typed helper to fetch a collection.
//this function is used in controller files
export function getCollection<T = any>(name: string): Collection<T> {
  if (!db) {
    throw new Error(`Database not initialized. Call connectToDB() first`);
  }
  return db.collection<T>(name);
}
