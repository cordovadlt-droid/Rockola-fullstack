const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql-12067d6-cordovadlt-rockola-fullstack2.f.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_0_qrfVaUkI4lK2ErfCH',
  database: 'defaultdb',
  port: 18418,
  ssl: { rejectUnauthorized: false } // Importante para Aiven
});

const sql = `CREATE TABLE IF NOT EXISTS CANCION (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor VARCHAR(100) NOT NULL,
    letra TEXT NOT NULL,
    pais_origen VARCHAR(50),
    fecha_lanzamiento DATE
);`;

connection.connect(err => {
  if (err) throw err;
  console.log("Conectado a Aiven...");
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("¡Tabla CANCION creada con éxito!");
    process.exit();
  });
});
