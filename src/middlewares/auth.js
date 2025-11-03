const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const h = req.headers["authorization"];
  if (!h) return res.status(401).json({ error: "Token requerido" });
  try {
    const decoded = jwt.verify(h.split(" ")[1], process.env.JWT_SECRET);
    const u = decoded.user || decoded;
    req.user = {
      sub: u.id || decoded.sub,
      role: u.rol || u.role,
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token invalido" });
  }
};
