import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
// Path to Vite build output
const buildPath = path.join(__dirname, "dist"); // <- matches your structure

console.log(buildPath);

// Serve static files
app.use(express.static(buildPath));

// Catch-all route for React Router
app.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
    console.log(`🚀 Local preview running at http://localhost:${port}`);
});
