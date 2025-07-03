import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();

const app = express();


const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.ENDPOINT
 
});

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path === "/" ? "/index.html" : req.path;
    const key = `dist/${id}${filePath}`;
  
    console.log("🌐 Host:", host);
    console.log("🧾 ID:", id);
    console.log("🗂️ S3 Key:", key);
  
    try {
      const command = new GetObjectCommand({ Bucket: "vercel", Key: key });
      const contents = await s3Client.send(command);
      const type = filePath.endsWith(".html")
        ? "text/html"
        : filePath.endsWith(".css")
        ? "text/css"
        : "application/javascript";
      res.set("Content-Type", type);
      if (contents.Body) {
        (contents.Body as Readable).pipe(res);
      } else {
        res.status(404).send("File not found.");
      }
    } catch (err) {
      console.error("❌ Error fetching file from S3:", err);
      res.status(404).send("File not found.");
    }
  });
  

app.listen(3002, () => {
  console.log("🚀 Handler service running on http://localhost:3002");
});
