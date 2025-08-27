// bin/www.js
const http = require("http");
require("dotenv").config();
const app = require("../app");

const port = normalizePort(process.env.PORT || "3520");
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Danzare API listening on port ${port}`));
server.on("error", onError);

function normalizePort(val) {
  const p = parseInt(val, 10);
  if (isNaN(p)) return val;
  if (p >= 0) return p;
  return false;
}
function onError(error) {
  if (error.syscall !== "listen") throw error;
  if (error.code === "EACCES") {
    console.error(`Port ${port} requires privileges`);
    process.exit(1);
  }
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} in use`);
    process.exit(1);
  }
  throw error;
}
