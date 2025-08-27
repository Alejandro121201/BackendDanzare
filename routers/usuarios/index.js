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

    console.log("[AUTH] Received id_token len:", id_token.length);

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("[AUTH] Google payload email:", payload?.email);

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

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
