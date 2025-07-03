import express from "express";
import cors from "cors";
import { simpleGit, } from 'simple-git';
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from 'redis';

const app = express();
const port = 3000;
app.use(express.json());
const publisher = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

 publisher.connect();

 const subscriber = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
 
 subscriber.connect();

app.use(express.json());

app.use(cors());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    const localPath = path.join(__dirname, `output/${id}`);
  
    // Clone the repo
    await simpleGit().clone(repoUrl, localPath);
  
    // Get all files, filter out .git and .env
    const files = getAllFiles(localPath).filter(file => {
      return !file.includes(".git") && !file.endsWith(".env");
    });
  
    // Upload all files with correct S3-safe key format
    for (const file of files) {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, "/"); // S3 key
      await uploadFile(relativePath, file);
    }
  
    // Push to Redis queue
    await publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
  
    res.json({ id : id });
  });

  app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

  app.listen(port, () => {
    console.log(`Your server is running on http://localhost:${port}`);
}); 
  
