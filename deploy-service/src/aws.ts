import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.ENDPOINT,
});

/**
 * Downloads all files from R2 with given prefix into local folder
 */
export async function downloadS3Folder(prefix: string) {
  const allFiles = await s3.send(
    new ListObjectsV2Command({
      Bucket: "vercel",
      Prefix: prefix,
    })
  );

  if (!allFiles.Contents || allFiles.Contents.length === 0) {
    console.warn("⚠️ No files found in R2 with prefix:", prefix);
    return;
  }

  const allPromises = allFiles.Contents.map(async ({ Key }) => {
    if (!Key) return;

    const finalOutputPath = path.join(process.cwd(), Key.replace(/\\/g, "/"));
    const dirName = path.dirname(finalOutputPath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    const getObjectResponse = await s3.send(
      new GetObjectCommand({
        Bucket: "vercel",
        Key,
      })
    );

    if (getObjectResponse.Body) {
      const bodyStream = getObjectResponse.Body as any;
      const writeStream = fs.createWriteStream(finalOutputPath);

      await new Promise<void>((resolve, reject) => {
        bodyStream.pipe(writeStream);
        bodyStream.on("end", resolve);
        bodyStream.on("error", reject);
      });

      console.log(`✅ Downloaded: ${Key}`);
    }
  });

  console.log("⏳ Waiting for all downloads...");
  await Promise.all(allPromises);
  console.log("✅ All files downloaded.");
}

/**
 * Uploads all files from output/{id}/dist to R2 under dist/{id}
 */
export async function copyFinalDist(id: string) {
  const folderPath = path.join(process.cwd(), `output/${id}/dist`);
  console.log("📁 Checking folder:", folderPath);

  if (!fs.existsSync(folderPath)) {
    console.error("❌ Folder does not exist:", folderPath);
    return;
  }

  const allFiles = getAllFiles(folderPath);
  console.log(`📦 Found ${allFiles.length} files to upload`);

  for (const file of allFiles) {
    const relativePath = file.slice(folderPath.length + 1).replace(/\\/g, "/");
    const s3Key = `dist/${id}/${relativePath}`;
    try {
      await uploadFile(s3Key, file);
    } catch (err) {
      console.error(`❌ Failed to upload ${s3Key}:`, err);
    }
  }

  console.log("✅ Upload complete.");
}

/**
 * Recursively collects all files under a folder
 */
export const getAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];

  const allItems = fs.readdirSync(folderPath);
  for (const file of allItems) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      response = response.concat(getAllFiles(fullPath));
    } else {
      response.push(fullPath);
    }
  }

  return response;
};

/**
 * Uploads a single file to R2
 */
const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3.send(
    new PutObjectCommand({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
  );

  console.log(`✅ Uploaded: ${fileName}`);
};
