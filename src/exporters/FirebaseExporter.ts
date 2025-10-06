import { DatabaseExporter } from "./DatabaseExporter";
import { FormattedFramerCmsData } from "../types/types";
import { firebaseCredentialsStructure } from "./connectionsConfig";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

let firebaseApp: FirebaseApp | null = null;

export class FirebaseExporter implements DatabaseExporter {
  async exportData(credentials: firebaseCredentialsStructure, data: FormattedFramerCmsData): Promise<void> {
    if (!firebaseApp) {
      firebaseApp = initializeApp(credentials as any);
    }

    try {
      const db = getFirestore(firebaseApp);

      const collRef = collection(db, "framer_cms");

      await addDoc(collRef, data as any);

      console.info("Dados exportados para Firebase com sucesso.");
    } catch (err) {
      console.error("Erro ao exportar dados para Firebase:", err);
      throw err;
    }
  }
}
