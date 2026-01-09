const mysql = require('mysql2');

module.exports = async (req, res) => {
    // 1. Configuración de conexión
    const connection = mysql.createConnection({
        host: 'mysql-12067d6-cordovadlt-rockola-fullstack2.f.aivencloud.com',
        user: 'avnadmin',
        password: 'AVNS_0_qrfVaUkI4lK2ErfCH',
        database: 'defaultdb',
        port: 18418,
        ssl: { rejectUnauthorized: false }
    });

    // 2. Extraer ID de la URL si existe (ejemplo: /api/5)
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1] !== 'api' ? urlParts[urlParts.length - 1] : null;

    try {
        if (req.method === 'GET') {
            connection.query('SELECT * FROM CANCION', (err, results) => {
                connection.end();
                if (err) return res.status(500).json([]); // Devolvemos array vacío si falla
                res.status(200).json(results);
            });
        } 
        else if (req.method === 'POST') {
            const { autor, letra, pais_origen, fecha_lanzamiento } = req.body;
            connection.query('INSERT INTO CANCION (autor, letra, pais_origen, fecha_lanzamiento) VALUES (?, ?, ?, ?)', 
            [autor, letra, pais_origen, fecha_lanzamiento], (err, result) => {
                connection.end();
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: result.insertId });
            });
        }
        // ... (puedes agregar DELETE y PATCH después)
    } catch (error) {
        if (connection) connection.end();
        res.status(500).json([]);
    }
};