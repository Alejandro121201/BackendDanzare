// routers/eventos/eventos.service.js
const dao = require("./eventos.dao");

function toIntOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
function toBool(v, def = true) {
  if (v === undefined || v === null || v === "") return def;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  return s === "1" || s === "true";
}
function toDateOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : v; // keep 'YYYY-MM-DD' string
}

// Accept "HH:mm" or "HH:mm:ss". Return normalized "HH:mm:ss" or null.
function toTimeOrNull(v) {
  if (!v && v !== 0) return null;
  const s = String(v).trim();
  if (s === "") return null;

  // Matches HH:mm or HH:mm:ss
  const m = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(s);
  if (!m) return null;

  const hh = m[1];
  const mm = m[2];
  const ss = m[3] ?? "00";
  return `${hh}:${mm}:${ss}`;
}

function parsePagination(query) {
  const limit = Math.min(Math.max(parseInt(query.limit ?? 20, 10), 1), 100);
  const offset = Math.max(parseInt(query.offset ?? 0, 10), 0);
  return { limit, offset };
}

async function list(query) {
  const { limit, offset } = parsePagination(query);
  const { q, activo, from, to } = query;
  return dao.list({ q, activo, from, to, limit, offset });
}

async function get(id) {
  const row = await dao.getById(id);
  if (!row)
    throw Object.assign(new Error("Evento no encontrado"), { status: 404 });
  return row;
}

async function create(body, fileUrl) {
  const payload = {
    nombre: body?.nombre,
    descripcion: body?.descripcion,
    precio: toIntOrNull(body?.precio),
    fecha: toDateOrNull(body?.fecha),
    hora_inicio: toTimeOrNull(body?.hora_inicio),
    hora_fin: toTimeOrNull(body?.hora_fin),
    imagen_url: fileUrl || body?.imagen_url,
    activo: toBool(body?.activo, true),
  };

  if (!payload.nombre)
    throw Object.assign(new Error("nombre es requerido"), { status: 400 });
  if (payload.precio === null || payload.precio < 0) {
    throw Object.assign(new Error("precio inválido"), { status: 400 });
  }
  if (!payload.fecha)
    throw Object.assign(new Error("fecha es requerida (YYYY-MM-DD)"), {
      status: 400,
    });
  if (!payload.imagen_url)
    throw Object.assign(new Error("imagen_url es requerido"), { status: 400 });

  const id = await dao.insert(payload);
  return dao.getById(id);
}

async function update(id, body, fileUrl) {
  const payload = {
    nombre: body?.nombre,
    descripcion: body?.descripcion,
    precio: toIntOrNull(body?.precio),
    fecha: toDateOrNull(body?.fecha),
    hora_inicio: toTimeOrNull(body?.hora_inicio),
    hora_fin: toTimeOrNull(body?.hora_fin),
    imagen_url: fileUrl || body?.imagen_url,
    activo: toBool(body?.activo, true),
  };
  const affected = await dao.updateById(id, payload);
  if (!affected)
    throw Object.assign(new Error("Evento no encontrado"), { status: 404 });
  return dao.getById(id);
}

async function remove(id) {
  const affected = await dao.deleteById(id);
  if (!affected)
    throw Object.assign(new Error("Evento no encontrado"), { status: 404 });
  return { id: Number(id), deleted: true };
}

module.exports = { list, get, create, update, remove };
