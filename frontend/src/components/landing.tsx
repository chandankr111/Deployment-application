import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleUpload = async () => {
    try {
      setUploading(true);
      const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, { repoUrl });
      setUploadId(res.data.id);
      const interval = setInterval(async () => {
        const statusRes = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`);
        if (statusRes.data.status === "deployed") {
          clearInterval(interval);
          setDeployed(true);
          setUploading(false);
        }
      }, 3000);
    } catch (err) {
      alert("Something went wrong during deployment!");
      setUploading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 transition-all">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🚀 Deploy Your GitHub Repo</CardTitle>
          <CardDescription>Enter your GitHub repo URL and launch your site in seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub Repository URL</Label>
            <Input
              id="github-url"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="dark:bg-gray-900"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploadId !== "" || uploading}
            className="w-full"
            type="submit"
          >
            {uploadId ? `Deploying (${uploadId})` : uploading ? "Uploading..." : "Upload & Deploy"}
          </Button>
        </CardContent>
      </Card>

      {deployed && (
        <Card className="w-full max-w-xl mt-8 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-green-700 dark:text-green-300">✅ Deployment Successful!</CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">Your site is live and ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="deployed-url">Deployed URL</Label>
              <Input
                id="deployed-url"
                readOnly
                type="url"
                value={`http://${uploadId}.chandanvercel.com:3002/index.html`}
                className="dark:bg-green-950"
              />
            </div>
            <Button className="w-full" variant="outline">
              <a href={`http://${uploadId}.chandanvercel.com/index.html`} target="_blank" rel="noopener noreferrer">
                🌐 Visit Website
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
