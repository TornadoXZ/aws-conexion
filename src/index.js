require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);

// Inicializar base de datos
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 