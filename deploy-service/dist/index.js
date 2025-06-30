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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const subscriber = (0, redis_1.createClient)({
    url: 'redis://localhost:6379',
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield subscriber.connect();
        while (true) {
            try {
                const response = yield subscriber.brPop('build-queue', 0);
                //@ts-ignore
                const id = response.element;
                console.log("📦 New deployment job:", id);
                console.log("⬇️ Downloading build from Cloudflare R2...");
                yield (0, aws_1.downloadS3Folder)(`output/${id}`);
                console.log("🔧 Building project...");
                yield (0, utils_1.buildProject)(id);
                console.log("⬆️ Uploading final dist...");
                yield (0, aws_1.copyFinalDist)(id);
                console.log("✅ Deployment complete:", id);
            }
            catch (err) {
                console.error("❌ Error during deployment:", err);
            }
        }
    });
}
main();
