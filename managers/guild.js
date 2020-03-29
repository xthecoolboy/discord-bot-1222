const pool = require("./mysql");

function getGuild(guild, msg) {
    return new Promise((resolve, reject) => {
        var id = msg.guild.id;
        var user = msg.author.id;

        pool.query("SELECT * FROM guilds WHERE discord=?", id, (err, res, f) => {
            if (err) return reject(err);
            if (res[0]) {
                resolve(res[0]);
            } else {
                var member = msg.guild.member(user);
                var uuid = "unhex(replace(uuid(),'-',''))";
                var query = `INSERT INTO guids (uuid_bin, discord, permissions) VALUE (${uuid}, ${guild.id}, ${member.permissions.bitfield})`;
                pool.query(query, function (error, results, fields) {
                    if (error) return reject(error);
                    var query2 = `SELECT  * FROM guilds WHERE id="${results.insertId}"`;
                    pool.query(query2, (error, results, fields) => {
                        if (error) return reject(error);
                        resolve(results[0]);
                    });
                });
            }
        });
    });
}
async function updateGuild(uuid, data, value) {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE guilds SET " + data + " = ? WHERE uuid=?", [value, uuid], (err, re, f) => {
            if (err) return reject(err);
            resolve(re, f);
        });
    });
}

function fetchGuild(...args) {
    return getGuild(...args);
}
module.exports = {
    getGuild,
    fetchGuild,
    updateGuild
};
