// routers/productos/index.js
const express = require("express");
const svc = require("./productos.service");
const { upload } = require("./utils/upload");
require("dotenv").config();

const STATIC_ROUTE = process.env.STATIC_ROUTE || "/uploads";

const router = express.Router();

function maybeMulter(req, res, next) {
  if (req.is("multipart/form-data")) {
    return upload.single("imagen")(req, res, next);
  }
  return next();
}

/**
 * GET /api/productos
 * Filters: ?q=, ?activo=0|1, ?limit=, ?offset=
 */
router.get("/", async (req, res, next) => {
  try {
    const data = await svc.list(req.query);
    res.json({ data: data.rows, meta: { total: data.total } });
  } catch (err) {
    next(err);
  }
});

/** GET /api/productos/:id */
router.get("/:id", async (req, res, next) => {
  try {
    const row = await svc.get(req.params.id);
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/productos
 * a) multipart/form-data with field "imagen" (file) + text fields
 * b) application/json with "imagen_url"
 */
router.post("/", maybeMulter, async (req, res, next) => {
  try {
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/productos/${req.file.filename}`
      : null;
    const row = await svc.create(req.body, fileUrl);
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** PUT /api/productos/:id (supports replacing image) */
router.put("/:id", maybeMulter, async (req, res, next) => {
  try {
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/productos/${req.file.filename}`
      : null;
    const row = await svc.update(req.params.id, req.body, fileUrl);
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/productos/:id */
router.delete("/:id", async (req, res, next) => {
  try {
    const out = await svc.remove(req.params.id);
    res.json({ data: out });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
