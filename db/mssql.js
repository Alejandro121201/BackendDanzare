// db/mssql.js
const sql = require("mssql");
const cfg = require("./config");

let poolPromise;

async function getPool() {
  if (!poolPromise) {
    const pool = new sql.ConnectionPool({
      server: cfg.server,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
      options: cfg.options,
      pool: cfg.pool,
    });

    poolPromise = pool
      .connect()
      .then((p) => {
        p.on("error", (err) => console.error("[mssql] pool error:", err));
        return p;
      })
      .catch((err) => {
        poolPromise = undefined;
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
