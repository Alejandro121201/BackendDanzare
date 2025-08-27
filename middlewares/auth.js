// middlewares/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    let token = null;

    if (header.startsWith("Bearer ")) token = header.slice(7);
    else if (req.cookies && req.cookies.token) token = req.cookies.token;

    if (!token)
      return res.status(401).json({ error: { message: "Unauthorized" } });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { uid, gid, role, email }
    next();
  } catch {
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
}

module.exports = { auth };
