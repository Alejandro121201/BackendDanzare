// routers/health/index.js
const express = require("express");
const { getPool } = require("../../db/mssql");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.recordset?.[0]?.ok === 1 });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
