import { DatabaseExporter } from "../exporters/DatabaseExporter";
import { MongoExporter } from "../exporters/MongoExporter";
import { FirebaseExporter } from "../exporters/FirebaseExporter";
import { SupportedDBs } from "../exporters/supportedDbs";
import { CouchDBExporter } from "../exporters/CouchDbExporter";

export function createExporter(dbType: SupportedDBs): DatabaseExporter {
  if (dbType === SupportedDBs.MONGODB) {
    return new MongoExporter();
  }
  if (dbType === SupportedDBs.COUCHDB) {
    return new CouchDBExporter();
  }
  if (dbType === SupportedDBs.FIREBASE) {
    return new FirebaseExporter();
  }
  throw new Error(`Database type not supported: ${dbType}`);
}
