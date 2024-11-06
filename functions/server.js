import { config } from 'dotenv'; // Cargar variables de entorno desde .env

import serverless from 'serverless-http';
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

config();

const app = express();
const PORT = process.env.PORT || 3000; // Usar el puerto desde la variable de entorno

// Configuración de SSL para la conexión a la base de datos, si es requerida
const sslConfig = process.env.DB_SSL === 'true' ? {
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA ? fs.readFileSync(process.env.DB_SSL_CA).toString() : undefined,
    key: process.env.DB_SSL_KEY ? fs.readFileSync(process.env.DB_SSL_KEY) : undefined,
    cert: process.env.DB_SSL_CERT ? fs.readFileSync(process.env.DB_SSL_CERT) : undefined,
  }
} : {};

// Configuración de la conexión a la base de datos usando variables de entorno y SSL si aplica
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 5000,
  ...sslConfig
});
/*
const PORT = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'aLL',
  password: 'hormigaLL',
  database: 'delfines'
}); */

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middleware
// enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API

// Obtener todos los jugadores
app.get('/api/jugadores', (req, res) => {
  db.query('SELECT * FROM jugadores', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
    console.log('Obteniendo jugadores....');
  });
});

// Obtener un jugador por ID
app.get('/api/jugadores/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM jugadores WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo jugador
app.post('/api/jugadores', (req, res) => {
  const { nombre, fdn, direccion, escuela, padres, telefono, talla } = req.body;
  db.query(
    'INSERT INTO jugadores (nombre, fdn, direccion, escuela, padres, telefono, talla) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, fdn, direccion, escuela, padres, telefono, talla],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ id: result.insertId });
      console.log('🏈 Nuevo jugador! 👍');
    }
  );
});

// Actualizar un jugador
app.put('/api/jugadores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fdn, direccion, escuela, padres, telefono, talla } = req.body;
  db.query(
    'UPDATE jugadores SET nombre = ?, fdn = ?, direccion = ?, escuela = ?, padres = ?, telefono = ?, talla = ? WHERE id = ?',
    [nombre, fdn, direccion, escuela, padres, telefono, talla, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ success: true });
      console.log('🏈 Jugador Actualizado! 👍');
    }
  );
});

// Eliminar un jugador
app.delete('/api/jugadores/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM jugadores WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ success: true });
    console.log('❌ Un Jugador menos! 🤷‍♂️ ');
  });
});

// Iniciar el servidor
app.use('/.netlify/functions/server');
export const handler = serverless(app);
/* app.listen(PORT, () => {
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
}); */
