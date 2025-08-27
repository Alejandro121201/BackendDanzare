// routers/eventos/eventos.dao.js
const { sql, getPool } = require("../../db/mssql");
const Q = require("./utils/eventos.query");

async function list({ q, activo, from, to, limit = 20, offset = 0 }) {
  const pool = await getPool();

  const req = pool.request();
  req.input("q", sql.NVarChar, q ?? null);
  req.input(
    "activo",
    sql.Bit,
    activo === undefined ? null : Boolean(Number(activo))
  );
  req.input("from", sql.Date, from ?? null);
  req.input("to", sql.Date, to ?? null);
  req.input("limit", sql.Int, Number(limit));
  req.input("offset", sql.Int, Number(offset));
  const data = await req.query(Q.list);

  const reqCount = pool.request();
  reqCount.input("q", sql.NVarChar, q ?? null);
  reqCount.input(
    "activo",
    sql.Bit,
    activo === undefined ? null : Boolean(Number(activo))
  );
  reqCount.input("from", sql.Date, from ?? null);
  reqCount.input("to", sql.Date, to ?? null);
  const countRes = await reqCount.query(Q.count);

  return { rows: data.recordset, total: countRes.recordset[0].total };
}

async function getById(id) {
  const pool = await getPool();
  const req = pool.request();
  req.input("id", sql.Int, Number(id));
  const res = await req.query(Q.getById);
  return res.recordset[0] || null;
}

async function insert(payload) {
  const {
    nombre,
    descripcion,
    precio,
    fecha,
    hora_inicio,
    hora_fin,
    imagen_url,
    activo = true,
  } = payload;
  const pool = await getPool();

  const req = pool.request();
  req.input("nombre", sql.NVarChar(100), nombre);
  req.input("descripcion", sql.NVarChar(sql.MAX), descripcion ?? null);
  req.input("precio", sql.Int, Number(precio));
  req.input("fecha", sql.Date, fecha);
  // send as VarChar to avoid strict time validation
  req.input("hora_inicio", sql.VarChar(8), hora_inicio ?? null); // 'HH:mm:ss' or null
  req.input("hora_fin", sql.VarChar(8), hora_fin ?? null); // 'HH:mm:ss' or null
  req.input("imagen_url", sql.NVarChar(sql.MAX), imagen_url);
  req.input("activo", sql.Bit, Boolean(activo));

  const res = await req.query(Q.insert);
  return res.recordset[0].id;
}

async function updateById(id, payload) {
  const {
    nombre,
    descripcion,
    precio,
    fecha,
    hora_inicio,
    hora_fin,
    imagen_url,
    activo,
  } = payload;
  const pool = await getPool();

  const req = pool.request();
  req.input("id", sql.Int, Number(id));
  req.input("nombre", sql.NVarChar(100), nombre);
  req.input("descripcion", sql.NVarChar(sql.MAX), descripcion ?? null);
  req.input("precio", sql.Int, Number(precio));
  req.input("fecha", sql.Date, fecha);
  // send as VarChar to avoid strict time validation
  req.input("hora_inicio", sql.VarChar(8), hora_inicio ?? null);
  req.input("hora_fin", sql.VarChar(8), hora_fin ?? null);
  req.input("imagen_url", sql.NVarChar(sql.MAX), imagen_url);
  req.input("activo", sql.Bit, Boolean(activo));

  const res = await req.query(Q.updateById);
  return res.recordset[0].affected;
}

async function deleteById(id) {
  const pool = await getPool();
  const req = pool.request();
  req.input("id", sql.Int, Number(id));
  const res = await req.query(Q.deleteById);
  return res.recordset[0].affected;
}

module.exports = { list, getById, insert, updateById, deleteById };
