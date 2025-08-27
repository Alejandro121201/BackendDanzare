// routers/bailes/bailes.dao.js
const { sql, getPool } = require("../../db/mssql");
const Q = require("./utils/bailes.query");

async function list({ q, activo, limit = 20, offset = 0 }) {
  const pool = await getPool();

  const req = pool.request();
  req.input("q", sql.NVarChar, q ?? null);
  req.input(
    "activo",
    sql.Bit,
    activo === undefined ? null : Boolean(Number(activo))
  );
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
    edad_minima,
    imagen_url,
    activo = true,
  } = payload;
  const pool = await getPool();
  const req = pool.request();
  req.input("nombre", sql.NVarChar(100), nombre);
  req.input("descripcion", sql.NVarChar(sql.MAX), descripcion ?? null);
  req.input("precio", sql.Int, Number(precio));
  req.input(
    "edad_minima",
    sql.Int,
    edad_minima == null ? null : Number(edad_minima)
  );
  req.input("imagen_url", sql.NVarChar(sql.MAX), imagen_url);
  req.input("activo", sql.Bit, Boolean(activo));
  const res = await req.query(Q.insert);
  return res.recordset[0].id;
}

async function updateById(id, payload) {
  const { nombre, descripcion, precio, edad_minima, imagen_url, activo } =
    payload;
  const pool = await getPool();
  const req = pool.request();
  req.input("id", sql.Int, Number(id));
  req.input("nombre", sql.NVarChar(100), nombre);
  req.input("descripcion", sql.NVarChar(sql.MAX), descripcion ?? null);
  req.input("precio", sql.Int, Number(precio));
  req.input(
    "edad_minima",
    sql.Int,
    edad_minima == null ? null : Number(edad_minima)
  );
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
