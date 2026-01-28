import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'kino-verwaltung';

let client = null;

export async function connectDb () {
  if (client) {
    return { client, db: client.db(dbName) };
  }

  client = new MongoClient(mongoUrl);
  await client.connect();
  return { client, db: client.db(dbName) };
}

export async function closeDb () {
  if (!client) return;
  await client.close();
  client = null;
}
