const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql-12067d6-cordovadlt-rockola-fullstack2.f.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_0_qrfVaUkI4lK2ErfCH',
  database: 'defaultdb',
  port: 18418,
  ssl: { rejectUnauthorized: false }
});

connection.query('SELECT * FROM CANCION', (err, results) => {
  if (err) {
    console.error('Error en la consulta: ' + err.stack);
    return;
  }
  console.log('--- LISTA DE CANCIONES ---');
  console.table(results); // Esto lo muestra como una tabla bonita en la terminal
  process.exit();
});