// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const mountRouters = require("./router.module");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());

// Static hosting for uploaded files (if you use it)
const STATIC_ROUTE = process.env.STATIC_ROUTE || "/uploads";
const FILE_STORAGE_ROOT = process.env.FILE_STORAGE_ROOT || "uploads";
const staticDir = path.isAbsolute(FILE_STORAGE_ROOT)
  ? FILE_STORAGE_ROOT
  : path.join(process.cwd(), FILE_STORAGE_ROOT);
app.use(STATIC_ROUTE, express.static(staticDir));

// Mount all feature routers
mountRouters(app);

// 404
app.use((req, res) => {
  res.status(404).json({ error: { message: "Not Found" } });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: status === 500 ? "Internal Server Error" : err.message,
    },
  });
});

module.exports = app;
