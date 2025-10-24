module.exports = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.user.rol)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  };
};
