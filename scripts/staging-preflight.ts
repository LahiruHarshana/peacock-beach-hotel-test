import { loadStagingConfig, pingStagingCloudinary, pingStagingDatabase } from "./staging-env";

async function main() {
  const config = loadStagingConfig();
  const databaseName = await pingStagingDatabase(config);
  const cloudinaryStatus = await pingStagingCloudinary(config);
  console.log("Staging preflight passed.");
  console.log(`Database: ${databaseName}`);
  console.log("URI database matches MONGODB_DB.");
  console.log(`Cloudinary ping: ${cloudinaryStatus}`);
  console.log("API secret was not printed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Staging preflight failed");
  process.exit(1);
});
