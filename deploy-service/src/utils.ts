import { spawn } from "child_process";
import path from "path";

export function buildProject(id: string): Promise<void> {
  const projectPath = path.join(process.cwd(), `output/${id}`);

  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["install", "&&", "npm", "run", "build"], {
      cwd: projectPath,
      shell: true, // Needed for '&&' to work
      env: process.env,
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
      } else {
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
