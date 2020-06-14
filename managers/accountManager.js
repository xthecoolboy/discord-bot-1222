const pool = require("./pool_mysql");
const { padWithZeroes, insertAt } = require("../utils");
const newEmbed = require("../embed");

function getUser(id, uuid = false) {
    return new Promise(function(resolve, reject) {
        var query;
        if(uuid) {
            query = `SELECT  * FROM users WHERE uuid="${id}"`;
        } else {
            query = `SELECT  * FROM users WHERE discord="${id}"`;
        }
        pool.query(query, function(error, results, fields) {
            if(error) return reject(error);

            if(results === undefined) return resolve(null);

            resolve(results[0]);
        });
    });
}
function fetchUserId(id) {
    return new Promise(function(resolve, reject) {
        var query = `SELECT  * FROM users WHERE id="${id}"`;
        pool.query(query, function(error, results, fields) {
            if(error) return reject(error);
            if(!results) return resolve(null);
            resolve(results[0]);
        });
    });
}

function createUser(id) {
    return new Promise(function(resolve, reject) {
        var uuid = "unhex(replace(uuid(),'-',''))";
        var query = `INSERT INTO users (uuid_bin, discord) VALUE (${uuid}, ${id})`;
        pool.query(query, function(error, results, fields) {
            if(error) return reject(error);
            var query2 = `SELECT  * FROM users WHERE id="${results.insertId}"`;
            pool.query(query2, (error, results, fields) => {
                if(error) return reject(error);
                resolve(results[0]);
            });
        });
    });
}

async function fetchUser(id, uuid = false) {
    var user = await getUser(id, uuid);
    if(!user && !uuid) {
        user = await createUser(id);
    } else if(!user) {
        user = undefined;
    }
    return user;
}
async function fetchUserUUID(id) {
    return await fetchUser(id, true);
}

var xpBreakpoints = [];

function xp() {
    var baseXP = 15;
    var numlevels = 150;
    var tempXP = 0;

    for(var level = 0; level < numlevels; level++) {
        tempXP = baseXP * (level * (level - 1) / 2);
        xpBreakpoints[level] = tempXP;
    }
};
xp();
xpBreakpoints.shift();// remove -0

function getLevel(user) {
    var i = 0;
    var minDiff = 1000;
    var ans;

    for(i in xpBreakpoints) {
        var m = Math.abs(user.xp - xpBreakpoints[i]);
        if(m < minDiff) {
            minDiff = m;
            ans = i;
        }
    }

    return parseInt(ans) + 1;
}

function getNextLevel(xp) {
    var i = 0;
    var minDiff = 1000;
    var ans;

    for(i in xpBreakpoints) {
        var m = Math.abs(xp - xpBreakpoints[i]);
        if(m < minDiff) {
            minDiff = m;
            ans = xpBreakpoints[i];
        }
    }

    return parseInt(ans);
}

function getPrevLevel(xp) {
    var i = 0;
    var minDiff = 1000;
    var ans;

    for(i in xpBreakpoints) {
        var m = Math.abs(xp - xpBreakpoints[i - 1]);
        if(m < minDiff) {
            minDiff = m;
            ans = xpBreakpoints[i - 1];
        }
    }

    return parseInt(ans) + 1;
}

function getMoney(user) {
    var bbs = padWithZeroes(user.bbs, 4);
    return insertAt(bbs, ".", bbs.length - 3) + " BBS";
}

function mine(user) {
    return new Promise((resolve, reject) => {
        var d;
        try {
            var t = user.last_mined.split(/[- :]/);
            d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
        } catch(e) {
            d = user.last_mined;
        }

        var now = Date.now();
        const oneDay = 60 * 60 * 12 * 1000;

        try {
            var canMine = (now - d) > oneDay;
        } catch(e) {
            canMine = true;
        }

        if(canMine) {
            var currentTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
            pool.query(`UPDATE users SET last_mined="${currentTimestamp}", bbs="${parseInt(user.bbs) + getLevel(user)}", xp="${parseInt(user.xp) + getLevel(user)}" WHERE uuid="${user.uuid}"`, (err) => {
                if(err) return reject(err);
                resolve(parseInt(user.bbs) + getLevel(user));
            });
        } else {
            resolve(oneDay - (now - d));
        }
    });
}

function achievments(id) {
    return new Promise(function(resolve, reject) {
        var query = `SELECT *, u.xp as u_xp FROM users u, achievments_awarded d, achievments a WHERE u.id="${id}" AND d.achievment = a.id AND d.user = u.id ORDER BY d.id DESC`;

        pool.query(query, function(error, results, fields) {
            if(error) reject(error);
            resolve(results);
        });
    });
}

function awardAchievment(id, code, msg) {
    return new Promise(function(resolve, reject) {
        var query = `INSERT INTO achievments_awarded (user, achievment) VALUES (${id}, (SELECT id FROM achievments WHERE code='${code}'))`;

        pool.query(query, function(error, results, fields) {
            if(error) reject(error);
            pool.query("SELECT * FROM achievments WHERE code='" + code + "'", (er, ac, fi) => {
                if(er) reject(er);
                var a = ac[0];
                pool.query(`UPDATE users SET bbs = bbs + ${a.value}, xp = xp + ${a.xp} WHERE id = ${id}`, async (e, res, f) => {
                    if(e) reject(e);
                    var level = updateLevels(await fetchUserId(id));
                    if(level) {
                        pool.query(`SELECT * FROM users WHERE id=${id}`, (erro, res) => {
                            if(erro) reject(erro);
                            levelUp(level, msg, res[0]);
                            resolve(results);
                        });
                    } else {
                        resolve(results);
                    }
                });
            });
        });
    });
}

async function levelUp(level, msg, user) {
    var embed = newEmbed();
    embed.setTitle(msg.author.username + " leveled up! ");
    embed.setDescription("Current level is " + level + ". XP points owned: " + user.xp + " / " + getNextLevel(user.xp));
    if(await msg.guild.settings.get("levelup", true)) {
        msg.channel.send(embed);
    }
}

function sendAchievment(a, msg, send = true) {
    var embed = newEmbed();
    var user = msg.author;
    embed.setTitle((send ? "Achievment Awarded: " : "") + a.name);
    embed.setDescription(a.description);
    embed.setAuthor(user.username + "#" + user.discriminator, user.avatarURL());
    embed.addField("BBS", a.value, true);
    embed.addField("XP", a.xp, true);
    embed.setTimestamp();

    return embed;
}

async function sendAchievmentUnique(msg, code) {
    var id = await fetchUser(msg.author.id);
    id = id.id;
    var achievmentsAwarded = await achievments(id);
    var hasNSFW = false;
    achievmentsAwarded.forEach((a) => {
        if(a.code === code) hasNSFW = true;
    });
    if(!hasNSFW) {
        awardAchievment(id, code, msg);
        achievmentsAwarded = await achievments(id);
        msg.channel.send(sendAchievment(achievmentsAwarded[0], msg));
    }
}

function updateLevels(user) {
    var level = getLevel(user);
    if(user.last_level !== level) {
        pool.query("UPDATE users SET last_level = " + level + " WHERE id = " + user.id, (e) => { if(e)throw e; });
        return level;
    }
    return null;
}

module.exports = {
    getUser,
    createUser,
    fetchUser,
    fetchUserUUID,
    getLevel,
    getMoney,
    mine,
    achievments,
    awardAchievment,
    sendAchievment,
    sendAchievmentUnique,
    updateLevels,
    levelUp,
    getNextLevel,
    getPrevLevel
};
