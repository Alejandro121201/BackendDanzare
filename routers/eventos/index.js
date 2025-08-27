// routers/eventos/index.js
const express = require("express");
const svc = require("./eventos.service");
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

/** LIST: ?q=&activo=0|1&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=&offset= */
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

/** CREATE (multipart or JSON) */
router.post("/", maybeMulter, async (req, res, next) => {
  try {
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/eventos/${req.file.filename}`
      : null;
    const row = await svc.create(req.body, fileUrl);
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
});

/** UPDATE (multipart or JSON) */
router.put("/:id", maybeMulter, async (req, res, next) => {
  try {
    const fileUrl = req.file
      ? `${STATIC_ROUTE}/eventos/${req.file.filename}`
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
