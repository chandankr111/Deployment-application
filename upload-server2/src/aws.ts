import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.ENDPOINT,
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const command = new PutObjectCommand({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    });
    const response = await s3Client.send(command);
    console.log(response);
}
