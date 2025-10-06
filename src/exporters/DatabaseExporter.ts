import { FormattedFramerCmsData } from "../types/types";
import { DbCredentialsStructure } from "./connectionsConfig";

export interface DatabaseExporter {
  exportData(dbCredentials: DbCredentialsStructure, data: FormattedFramerCmsData): Promise<void>;
}
