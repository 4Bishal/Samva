import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.resolve(__dirname, "./dist");
console.log("Serving from:", buildPath);

// ✅ Serve correct MIME for static files
app.use(
    express.static(buildPath, {
        setHeaders: (res, path) => {
            if (path.endsWith(".css")) {
                res.setHeader("Content-Type", "text/css");
            }
            if (path.endsWith(".js")) {
                res.setHeader("Content-Type", "application/javascript");
            }
        },
    })
);

// ✅ Catch-all for React Router
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
    console.log(`🚀 Running on port ${port}`);
});
