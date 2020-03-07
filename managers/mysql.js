var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'johnny.heliohost.org',
    port: '3306',
    user: 'danbulan_ice',
    password: 'Sql554;',
    database: 'danbulan_ice'
});

module.exports = pool;