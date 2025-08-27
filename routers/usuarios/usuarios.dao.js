// routers/usuarios/usuarios.dao.js
const { sql, getPool } = require("../../db/mssql");
const Q = require("./utils/usuarios.query");

async function upsertFromGoogle(payload) {
  const pool = await getPool();
  const req = pool.request();

  req.input("google_id", sql.NVarChar(100), payload.google_id);
  req.input("email", sql.NVarChar(100), payload.email);
  req.input(
    "nombre_completo",
    sql.NVarChar(100),
    payload.nombre_completo ?? null
  );
  req.input("nombre", sql.NVarChar(50), payload.nombre ?? null);
  req.input("apellido", sql.NVarChar(50), payload.apellido ?? null);
  req.input("foto_url", sql.NVarChar(sql.MAX), payload.foto_url ?? null);
  req.input("idioma", sql.NVarChar(10), payload.idioma ?? null);

  const res = await req.query(Q.upsertFromGoogle);
  const id = res.recordset[0].id;
  return getById(id);
}

async function getById(id) {
  const pool = await getPool();
  const req = pool.request();
  req.input("id", sql.Int, Number(id));
  const r = await req.query(Q.getById);
  return r.recordset[0] || null;
}

module.exports = { upsertFromGoogle, getById };
