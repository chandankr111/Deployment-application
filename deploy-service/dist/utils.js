"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = buildProject;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function buildProject(id) {
    const projectPath = path_1.default.join(process.cwd(), `output/${id}`);
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)("npm", ["install", "&&", "npm", "run", "build"], {
            cwd: projectPath,
            shell: true, // Enables '&&'
            env: Object.assign(Object.assign({}, process.env), { NODE_OPTIONS: "--openssl-legacy-provider" }),
        });
        child.stdout.on("data", (data) => {
            console.log(`[build stdout]: ${data}`);
        });
        child.stderr.on("data", (data) => {
            console.error(`[build stderr]: ${data}`);
        });
        child.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Build successful");
                resolve();
            }
            else {
                console.error(`❌ Build process exited with code ${code}`);
                reject(new Error(`Build failed with code ${code}`));
            }
        });
        child.on("error", (err) => {
            console.error("❌ Failed to start build process:", err);
            reject(err);
        });
    });
}
