// routers/usuarios/usuarios.service.js
const dao = require("./usuarios.dao");

function mapGooglePayload(googlePayload) {
  return {
    google_id: googlePayload.sub,
    email: googlePayload.email,
    nombre_completo: googlePayload.name || null,
    nombre: googlePayload.given_name || null,
    apellido: googlePayload.family_name || null,
    foto_url: googlePayload.picture || null,
    idioma: googlePayload.locale || null,
  };
}

async function upsertFromGoogle(googlePayload) {
  const p = mapGooglePayload(googlePayload);
  if (!p.google_id || !p.email) {
    const e = new Error("Invalid Google payload (sub/email missing)");
    e.status = 400;
    throw e;
  }
  return dao.upsertFromGoogle(p);
}

async function getById(id) {
  const u = await dao.getById(id);
  if (!u) {
    const e = new Error("Usuario no encontrado");
    e.status = 404;
    throw e;
  }
  return u;
}

module.exports = { upsertFromGoogle, getById };
