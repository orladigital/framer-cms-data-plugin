import { createExporter } from "../factory/ExporterFactory";
import { SupportedDBs } from "../exporters/supportedDbs";
import { DbCredentialsStructure } from "../exporters/connectionsConfig";
import { FormattedFramerCmsData } from "../types/types";

export async function exportedData(
  dbType: SupportedDBs,
  config: DbCredentialsStructure,
  data: FormattedFramerCmsData
): Promise<void> {
  const exporter = createExporter(dbType);

  await exporter.exportData(config, data);
}
