import { createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient({
  url: 'redis://localhost:6379',
});
const publisher = createClient({
    url: 'redis://localhost:6379',
  });
 
async function main() {
  await subscriber.connect();
 await publisher.connect();

  while (true) {
    try {
      const response = await subscriber.brPop('build-queue', 0);
      //@ts-ignore
      const id = response.element;

      console.log("📦 New deployment job:", id);

      console.log("⬇️ Downloading build from Cloudflare R2...");
      await downloadS3Folder(`output/${id}`);

      console.log("🔧 Building project...");
      await buildProject(id);

      console.log("⬆️ Uploading final dist...");
      await copyFinalDist(id);
      publisher.hSet("status", id, "deployed");

     
      console.log("✅ Deployment complete:", id);
    } catch (err) {
      console.error("❌ Error during deployment:", err);
    }
  }
}

main();
