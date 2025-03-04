const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token requerido');
  }
  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido');
    }
    req.usuario = decoded;
    next();
  });
};

module.exports = verificarToken;
