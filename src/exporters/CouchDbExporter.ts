import { DatabaseExporter } from "./DatabaseExporter";
import { FormattedFramerCmsData } from "../types/types";
import { couchDbCredentialsStructure } from "./connectionsConfig";
import couchbase from "couchbase";

export class CouchDBExporter implements DatabaseExporter {
  
  async exportData(dbCredentials: couchDbCredentialsStructure, data: FormattedFramerCmsData): Promise<void> {
    // const { uri, database } = dbCredentials;

    // if (!uri || !database) {
    //   throw new Error("CouchDB credentials are missing 'url' or 'database'.");
    // }

    
    // try {
      
    //   const connection = await couchbase.connect(uri);
    //   const db = connection.bucket(database);
    //   // await db.insert(data as any);

    //   console.info("Dados exportados para CouchDB com sucesso.");
    // } catch (err) {
    //   console.error("Erro ao exportar dados para CouchDB:", err);
    //   throw err;
    // }
  }
}