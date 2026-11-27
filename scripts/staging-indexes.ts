import { MongoClient } from "mongodb";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { DATABASE_NAMES, redactConnectionError } from "../src/lib/security/database-target";
import { loadStagingConfig, pingStagingDatabase } from "./staging-env";

async function main() {
  const config = loadStagingConfig();
  const confirmed = await pingStagingDatabase(config);
  if (confirmed !== DATABASE_NAMES.staging) {
    throw new Error("Refusing index changes because the connected database is not peacock_beach_staging.");
  }
  const client = new MongoClient(config.uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const db = client.db(confirmed);
    await ensureDatabaseIndexes(db);
    const names = await db.listCollections().toArray();
    console.log(`Indexes ensured on ${db.databaseName}.`);
    console.log(`Collections present: ${names.length}.`);
  } catch (error) {
    throw new Error(redactConnectionError(error));
  } finally {
    await client.close().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Staging index check failed");
  process.exit(1);
});
