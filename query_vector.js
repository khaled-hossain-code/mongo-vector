import "dotenv/config";

import { formatDocumentsAsString } from "langchain/util/document";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as fs from "fs";

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

async function run() {
  try {
    // Configure your Atlas collection
    const database = client.db("langchain_db");
    const collection = database.collection("test");
    const dbConfig = {
      collection: collection,
      indexName: "vector_index", // The name of the Atlas search index to use.
      textKey: "text", // Field name for the raw text content. Defaults to "text".
      embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
    };

    // Instantiate Atlas as a vector store
    const vectorStore = new MongoDBAtlasVectorSearch(
      new OpenAIEmbeddings(),
      dbConfig
    );

    // Basic semantic search
    const basicOutput = await vectorStore.similaritySearch(
      "MongoDB Atlas security"
    );
    const basicResults = basicOutput.map((results) => ({
      pageContent: results.pageContent,
      pageNumber: results.metadata.loc.pageNumber,
    }));

    console.log("Semantic Search Results:");
    console.log(basicResults);
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
