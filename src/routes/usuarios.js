const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Función para leer el archivo usuarios.json
const leerUsuarios = () => {
  const data = fs.readFileSync('./data/usuarios.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar en usuarios.json
const guardarUsuarios = (data) => {
  fs.writeFileSync('./data/usuarios.json', JSON.stringify(data, null, 2));
};

// Obtener todos los usuarios
router.get('/', (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});


// Obtener usuarios por id

router.get('/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.json(usuario);
});


// Registrar un nuevo usuario (con generación de token)
router.post('/registro', (req, res) => {
  const usuarios = leerUsuarios();
  const nuevoUsuario = { id: uuidv4(), ...req.body };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  // Generar token JWT
  const token = jwt.sign({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre }, 'secreto', { expiresIn: '1h' });

  res.status(201).json({ nuevoUsuario, token });
});

// Iniciar sesión y generar token
router.post('/login', (req, res) => {
  const { email } = req.body;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  // Generar token JWT
  const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, 'secreto', { expiresIn: '1h' });

  res.json({ mensaje: 'Inicio de sesión exitoso', token });
});


//crear usuario

router.post('/crear', (req, res) => {
  const usuarios = leerUsuarios();
  const nuevoUsuario = { id: uuidv4(),...req.body };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.status(201).json({ nuevoUsuario });
});


// Actualizar un usuario
router.put('/:id', (req, res) => {
  let usuarios = leerUsuarios();
  usuarios = usuarios.map(usuario =>
    usuario.id === req.params.id ? { ...usuario, ...req.body } : usuario
  );
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario actualizado' });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  let usuarios = leerUsuarios();
  usuarios = usuarios.filter(usuario => usuario.id !== req.params.id);
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario eliminado' });
});

module.exports = router;
