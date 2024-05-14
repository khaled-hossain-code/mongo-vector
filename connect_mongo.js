import "dotenv/config";

import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

async function run() {
  try {
    // Configure your Atlas collection
    const database = client.db("langchain_db");
    const collection = database.collection("test");

    const query = { text: "Back to the Future" };
    const movie = await collection.findOne(query);
    console.log(movie);
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
