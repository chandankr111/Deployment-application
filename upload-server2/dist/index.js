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
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = require("simple-git");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const file_1 = require("./file");
const aws_1 = require("./aws");
const redis_1 = require("redis");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const publisher = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
publisher.connect();
const subscriber = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
subscriber.connect();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    const id = (0, utils_1.generate)();
    const localPath = path_1.default.join(__dirname, `output/${id}`);
    // Clone the repo
    yield (0, simple_git_1.simpleGit)().clone(repoUrl, localPath);
    // Get all files, filter out .git and .env
    const files = (0, file_1.getAllFiles)(localPath).filter(file => {
        return !file.includes(".git") && !file.endsWith(".env");
    });
    // Upload all files with correct S3-safe key format
    for (const file of files) {
        const relativePath = path_1.default.relative(__dirname, file).replace(/\\/g, "/"); // S3 key
        yield (0, aws_1.uploadFile)(relativePath, file);
    }
    // Push to Redis queue
    yield publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({ id: id });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({
        status: response
    });
}));
app.listen(port, () => {
    console.log(`Your server is running on http://localhost:${port}`);
});
