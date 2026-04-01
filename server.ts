import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

// Initialize Firebase Admin
try {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Key Validation Middleware
  const validateApiKey = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({ error: "API key is required in x-api-key header." });
    }

    try {
      const usersRef = db.collection("users");
      const userQuery = await usersRef.where("apiKey", "==", apiKey).limit(1).get();

      if (userQuery.empty) {
        return res.status(401).json({ error: "Invalid API key." });
      }

      const userDoc = userQuery.docs[0];
      (req as any).user = { id: userDoc.id, ...userDoc.data() };
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(500).json({ error: "Internal server error during authentication." });
    }
  };

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // V1 API Endpoints
  app.post("/v1/upload", validateApiKey, upload.single("image"), async (req, res) => {
    const file = req.file;
    const user = (req as any).user;

    if (!file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    try {
      const fileId = uuidv4();
      const fileName = `${fileId}_${file.originalname}`;
      const blob = bucket.file(`images/${user.id}/${fileName}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Failed to upload image to storage." });
      });

      blobStream.on("finish", async () => {
        // Make the file public
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Save to Firestore
        const imageData = {
          id: fileId,
          url: publicUrl,
          name: file.originalname,
          ownerId: user.id,
          createdAt: new Date().toISOString(),
          size: file.size,
          mimeType: file.mimetype,
          storagePath: blob.name,
        };

        await db.collection("images").doc(fileId).set(imageData);

        res.json({
          success: true,
          id: fileId,
          url: publicUrl,
          name: file.originalname,
        });
      });

      blobStream.end(file.buffer);
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Internal server error during upload." });
    }
  });

  app.get("/v1/assets", validateApiKey, async (req, res) => {
    const user = (req as any).user;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const imagesRef = db.collection("images");
      const imagesQuery = await imagesRef
        .where("ownerId", "==", user.id)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset(offset)
        .get();

      const images = imagesQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json({
        success: true,
        count: images.length,
        assets: images,
      });
    } catch (error) {
      console.error("Assets Error:", error);
      res.status(500).json({ error: "Internal server error while fetching assets." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
