const mysql = require('mysql2');

module.exports = async (req, res) => {
    const connection = mysql.createConnection({
        host: process.env.MYSQLHOST || 'mysql-12067d6-cordovadlt-rockola-fullstack2.f.aivencloud.com',
        user: process.env.MYSQLUSER || 'avnadmin',
        password: process.env.MYSQLPASSWORD || 'AVNS_0_qrfVaUkI4lK2ErfCH',
        database: process.env.MYSQLDATABASE || 'defaultdb',
        port: 18418,
        ssl: { rejectUnauthorized: false }
    });

    // Extraer ID si existe en la ruta (ej: /api/5 -> id = 5)
    const pathSegments = req.url.split('/').filter(Boolean);
    const id = pathSegments.length > 1 ? pathSegments[1] : null;

    try {
        if (req.method === 'GET') {
            connection.query('SELECT * FROM CANCION', (err, results) => {
                connection.end();
                if (err) return res.status(500).json({ error: err.message });
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
        else if (req.method === 'DELETE' && id) {
            connection.query('DELETE FROM CANCION WHERE id = ?', [id], (err) => {
                connection.end();
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: "Eliminado" });
            });
        }
        else if (req.method === 'PATCH' && id) {
            const { autor, letra, pais_origen, fecha_lanzamiento } = req.body;
            connection.query('UPDATE CANCION SET autor=?, letra=?, pais_origen=?, fecha_lanzamiento=? WHERE id=?', 
            [autor, letra, pais_origen, fecha_lanzamiento, id], (err) => {
                connection.end();
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: "Actualizado" });
            });
        }
    } catch (e) {
        connection.end();
        res.status(500).json({ error: "Error de servidor" });
    }
};