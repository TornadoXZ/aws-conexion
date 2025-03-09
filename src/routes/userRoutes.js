const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pool } = require('../config/database');
const { uploadToS3 } = require('../config/s3');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // límite de 5MB
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario
router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email } = req.body;
    let profilePictureUrl = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      profilePictureUrl = await uploadToS3(req.file, fileName);
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, profile_picture) VALUES (?, ?, ?)',
      [name, email, profilePictureUrl]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      profile_picture: profilePictureUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar un usuario
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    let profilePictureUrl = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      profilePictureUrl = await uploadToS3(req.file, fileName);
    }

    const updateQuery = profilePictureUrl
      ? 'UPDATE users SET name = ?, email = ?, profile_picture = ? WHERE id = ?'
      : 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    
    const updateParams = profilePictureUrl
      ? [name, email, profilePictureUrl, id]
      : [name, email, id];

    await pool.query(updateQuery, updateParams);
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router; 