// routers/auth/index.js
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const userSvc = require("../usuarios/usuarios.service");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      const e = new Error("id_token is required");
      e.status = 400;
      throw e;
    }

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // { sub, email, name, given_name, family_name, picture, locale, ... }

    const user = await userSvc.upsertFromGoogle(payload);

    const token = jwt.sign(
      {
        uid: user.id,
        gid: user.google_id,
        email: user.email,
        role: user.rol || "usuario",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    // opcional: cookie httpOnly
    // res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', secure: false });

    res.json({
      token,
      user: {
        id: user.id,
        google_id: user.google_id,
        email: user.email,
        nombre_completo: user.nombre_completo,
        nombre: user.nombre,
        apellido: user.apellido,
        foto_url: user.foto_url,
        idioma: user.idioma,
        rol: user.rol,
        fecha_registro: user.fecha_registro,
        ultimo_login: user.ultimo_login,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
