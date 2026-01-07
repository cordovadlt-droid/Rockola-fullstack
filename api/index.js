const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE BASE DE DATOS ---
// Nota: En Vercel, estos valores vendrán de las "Environment Variables" del panel
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false } // Requerido por la mayoría de DBs en la nube
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos');
});

// --- RUTAS API ---

app.get('/', (req, res) => {
    res.send('🎸 API ROCKOLA ONLINE funcionando correctamente.');
});

app.get('/api/canciones', (req, res) => {
    const sql = 'SELECT * FROM CANCION';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/canciones/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM CANCION WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "No encontrada" });
        res.json(result[0]);
    });
});

app.post('/api/canciones', (req, res) => {
    const { letra, autor, fecha_lanzamiento, pais_origen } = req.body;
    const sql = 'INSERT INTO CANCION (letra, autor, fecha_lanzamiento, pais_origen) VALUES (?, ?, ?, ?)';
    db.query(sql, [letra, autor, fecha_lanzamiento, pais_origen], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, message: 'Creada con éxito' });
    });
});

app.patch('/api/canciones/:id', (req, res) => {
    const { id } = req.params;
    const campos = req.body;
    const keys = Object.keys(campos);
    const values = Object.values(campos);
    if (keys.length === 0) return res.status(400).json({ message: "Nada que actualizar" });

    const setQuery = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE CANCION SET ${setQuery} WHERE id = ?`;

    db.query(sql, [...values, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Actualizada con éxito" });
    });
});

app.delete('/api/canciones/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM CANCION WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminada con éxito" });
    });
});

// --- MANEJO DE DESPLIEGUE ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local en puerto ${PORT}`);
    });
}

// Esto es lo que Vercel necesita
module.exports = app;