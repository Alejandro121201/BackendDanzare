// routers/bailes/index.js
const express = require("express");
const svc = require("./bailes.service");
const { upload } = require("./utils/upload");
require("dotenv").config();

const STATIC_ROUTE = process.env.STATIC_ROUTE || "/uploads";

const router = express.Router();

// Run multer ONLY if content-type is multipart/form-data
function maybeMulter(req, res, next) {
  if (req.is("multipart/form-data")) {
    return upload.single("imagen")(req, res, next);
  }
  return next();
}

/** LIST */
router.get("/", async (req, res, next) => {
  try {
    const data = await svc.list(req.query);
    res.json({ data: data.rows, meta: { total: data.total } });
  } catch (err) {
    next(err);
  }
});

/** GET by id */
router.get("/:id", async (req, res, next) => {
  try {
    const row = await svc.get(req.params.id);
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** CREATE */
router.post("/", maybeMulter, async (req, res, next) => {
  try {
    // If a file was uploaded, build the public URL using STATIC_ROUTE
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/bailes/${req.file.filename}`
      : null;
    const row = await svc.create(req.body, fileUrl);
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** UPDATE */
router.put("/:id", maybeMulter, async (req, res, next) => {
  try {
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/bailes/${req.file.filename}`
      : null;
    const row = await svc.update(req.params.id, req.body, fileUrl);
    res.json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** DELETE */
router.delete("/:id", async (req, res, next) => {
  try {
    const out = await svc.remove(req.params.id);
    res.json({ data: out });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
