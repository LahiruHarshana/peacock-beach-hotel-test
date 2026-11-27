import "server-only";
import { MongoClient, type Db } from "mongodb";
import { getEnv } from "@/lib/env";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const { MONGODB_URI } = getEnv();
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      }).connect();
    }
    return global._mongoClientPromise;
  }
  return new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(getEnv().MONGODB_DB);
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}
