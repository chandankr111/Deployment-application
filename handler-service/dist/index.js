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
const express_1 = __importDefault(require("express"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    endpoint: process.env.ENDPOINT
});
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path === "/" ? "/index.html" : req.path;
    const key = `dist/${id}${filePath}`;
    console.log("🌐 Host:", host);
    console.log("🧾 ID:", id);
    console.log("🗂️ S3 Key:", key);
    try {
        const command = new client_s3_1.GetObjectCommand({ Bucket: "vercel", Key: key });
        const contents = yield s3Client.send(command);
        const type = filePath.endsWith(".html")
            ? "text/html"
            : filePath.endsWith(".css")
                ? "text/css"
                : "application/javascript";
        res.set("Content-Type", type);
        if (contents.Body) {
            contents.Body.pipe(res);
        }
        else {
            res.status(404).send("File not found.");
        }
    }
    catch (err) {
        console.error("❌ Error fetching file from S3:", err);
        res.status(404).send("File not found.");
    }
}));
app.listen(3002, () => {
    console.log("🚀 Handler service running on http://localhost:3002");
});
