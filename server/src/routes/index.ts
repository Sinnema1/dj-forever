import type { Response } from "express";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();

// Resolve __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serves the frontend in production.
 * If the requested route is not found, it falls back to serving the React `index.html`.
 */
router.use((_req, res: Response) => {
  try {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  } catch (error) {
    console.error("Error serving frontend:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;