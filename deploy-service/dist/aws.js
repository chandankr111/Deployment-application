"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
exports.downloadS3Folder = downloadS3Folder;
exports.copyFinalDist = copyFinalDist;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    endpoint: process.env.ENDPOINT,
});
/**
 * Downloads all files from R2 with given prefix into local folder
 */
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield s3.send(new client_s3_1.ListObjectsV2Command({
            Bucket: "vercel",
            Prefix: prefix,
        }));
        if (!allFiles.Contents || allFiles.Contents.length === 0) {
            console.warn("⚠️ No files found in R2 with prefix:", prefix);
            return;
        }
        const allPromises = allFiles.Contents.map((_a) => __awaiter(this, [_a], void 0, function* ({ Key }) {
            if (!Key)
                return;
            const finalOutputPath = path_1.default.join(process.cwd(), Key.replace(/\\/g, "/"));
            const dirName = path_1.default.dirname(finalOutputPath);
            if (!fs_1.default.existsSync(dirName)) {
                fs_1.default.mkdirSync(dirName, { recursive: true });
            }
            const getObjectResponse = yield s3.send(new client_s3_1.GetObjectCommand({
                Bucket: "vercel",
                Key,
            }));
            if (getObjectResponse.Body) {
                const bodyStream = getObjectResponse.Body;
                const writeStream = fs_1.default.createWriteStream(finalOutputPath);
                yield new Promise((resolve, reject) => {
                    bodyStream.pipe(writeStream);
                    bodyStream.on("end", resolve);
                    bodyStream.on("error", reject);
                });
                console.log(`✅ Downloaded: ${Key}`);
            }
        }));
        console.log("⏳ Waiting for all downloads...");
        yield Promise.all(allPromises);
        console.log("✅ All files downloaded.");
    });
}
/**
 * Uploads all files from output/{id}/dist to R2 under dist/{id}
 */
function copyFinalDist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path_1.default.join(process.cwd(), `output/${id}/dist`);
        console.log("📁 Checking folder:", folderPath);
        if (!fs_1.default.existsSync(folderPath)) {
            console.error("❌ Folder does not exist:", folderPath);
            return;
        }
        const allFiles = (0, exports.getAllFiles)(folderPath);
        console.log(`📦 Found ${allFiles.length} files to upload`);
        for (const file of allFiles) {
            const relativePath = file.slice(folderPath.length + 1).replace(/\\/g, "/");
            const s3Key = `dist/${id}/${relativePath}`;
            try {
                yield uploadFile(s3Key, file);
            }
            catch (err) {
                console.error(`❌ Failed to upload ${s3Key}:`, err);
            }
        }
        console.log("✅ Upload complete.");
    });
}
/**
 * Recursively collects all files under a folder
 */
const getAllFiles = (folderPath) => {
    let response = [];
    const allItems = fs_1.default.readdirSync(folderPath);
    for (const file of allItems) {
        const fullPath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullPath).isDirectory()) {
            response = response.concat((0, exports.getAllFiles)(fullPath));
        }
        else {
            response.push(fullPath);
        }
    }
    return response;
};
exports.getAllFiles = getAllFiles;
/**
 * Uploads a single file to R2
 */
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.send(new client_s3_1.PutObjectCommand({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }));
    console.log(`✅ Uploaded: ${fileName}`);
});
