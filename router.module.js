// router.module.js
module.exports = (app) => {
  // Health
  app.use("/api/health", require("./routers/health"));

  // Bailes
  app.use("/api/bailes", require("./routers/bailes"));

  // Eventos
  app.use("/api/eventos", require("./routers/eventos"));

  // Productos
  app.use("/api/productos", require("./routers/productos"));

  // Auth (Google)
  app.use("/api/auth", require("./routers/auth"));

  // Usuarios (perfil)
  app.use("/api/usuarios", require("./routers/usuarios"));

  app.get("/", (_req, res) => res.json({ ok: true, name: "Danzare API" }));
};
