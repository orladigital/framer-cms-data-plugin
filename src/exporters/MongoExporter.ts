import { DatabaseExporter } from "./DatabaseExporter";
import { FormattedFramerCmsData } from "../types/types";
import { mongoDbCredentialsStructure } from "./connectionsConfig";
import { MongoClient } from "mongodb";

export class MongoExporter implements DatabaseExporter {
  
  async exportData(dbCredentials: mongoDbCredentialsStructure, data: FormattedFramerCmsData): Promise<void> {
    // const { uri, database } = dbCredentials;

    // if (!uri || !database) {
    //   throw new Error("MongoDB credentials are missing 'uri' or 'database'.");
    // }

    // const client = new MongoClient(uri);

    // try {
    //   await client.connect();
    //   const db = client.db(database);
    //   const collection = db.collection("framer_cms");
    //   await collection.insertOne(data);
    //   console.info("Dados exportados para MongoDB com sucesso.");
    // } catch (err) {
    //   console.error("Erro ao exportar dados para MongoDB:", err);
    //   throw err;
    // } finally {
    //   await client.close();
    // }
  }
}
