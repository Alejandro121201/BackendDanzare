// routers/eventos/utils/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const FILE_STORAGE_ROOT = process.env.FILE_STORAGE_ROOT || "uploads";

// Compute "eventos" directory under storage root
const eventosDir = path.isAbsolute(FILE_STORAGE_ROOT)
  ? path.join(FILE_STORAGE_ROOT, "eventos")
  : path.join(process.cwd(), FILE_STORAGE_ROOT, "eventos");

fs.mkdirSync(eventosDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, eventosDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const base = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok)
    return cb(new Error("Only image files are allowed (jpg, png, webp)"));
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = { upload };
