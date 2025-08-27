// routers/bailes/bailes.service.js
const dao = require("./bailes.dao");

function toIntOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
function toBool(v, def = true) {
  if (v === undefined || v === null || v === "") return def;
  if (typeof v === "boolean") return v;
  // accept "1"/"0"/"true"/"false"
  const s = String(v).toLowerCase();
  return s === "1" || s === "true";
}

function parsePagination(query) {
  const limit = Math.min(Math.max(parseInt(query.limit ?? 20, 10), 1), 100);
  const offset = Math.max(parseInt(query.offset ?? 0, 10), 0);
  return { limit, offset };
}

async function list(query) {
  const { limit, offset } = parsePagination(query);
  const { q, activo } = query;
  return dao.list({ q, activo, limit, offset });
}

async function get(id) {
  const row = await dao.getById(id);
  if (!row)
    throw Object.assign(new Error("Baile no encontrado"), { status: 404 });
  return row;
}

async function create(body, fileUrl) {
  // Prefer uploaded file URL if present; otherwise use imagen_url in JSON
  const payload = {
    nombre: body?.nombre,
    descripcion: body?.descripcion,
    precio: toIntOrNull(body?.precio),
    edad_minima: toIntOrNull(body?.edad_minima),
    imagen_url: fileUrl || body?.imagen_url,
    activo: toBool(body?.activo, true),
  };

  if (!payload.nombre) {
    throw Object.assign(new Error("nombre es requerido"), { status: 400 });
  }
  if (payload.precio === null || payload.precio < 0) {
    throw Object.assign(new Error("precio inválido"), { status: 400 });
  }
  if (!payload.imagen_url) {
    throw Object.assign(new Error("imagen_url es requerido"), { status: 400 });
  }

  const id = await dao.insert(payload);
  return dao.getById(id);
}

async function update(id, body, fileUrl) {
  const payload = {
    nombre: body?.nombre,
    descripcion: body?.descripcion,
    precio: toIntOrNull(body?.precio),
    edad_minima: toIntOrNull(body?.edad_minima),
    imagen_url: fileUrl || body?.imagen_url,
    activo: toBool(body?.activo, true),
  };

  const affected = await dao.updateById(id, payload);
  if (!affected)
    throw Object.assign(new Error("Baile no encontrado"), { status: 404 });
  return dao.getById(id);
}

async function remove(id) {
  const affected = await dao.deleteById(id);
  if (!affected)
    throw Object.assign(new Error("Baile no encontrado"), { status: 404 });
  return { id: Number(id), deleted: true };
}

module.exports = { list, get, create, update, remove };
