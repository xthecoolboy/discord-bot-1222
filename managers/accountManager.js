const pool = require("./pool_mysql");
const { padWithZeroes, insertAt } = require("../utils");
const newEmbed = require("../embed");

async function getUser(id, uuid = false) {
    var query;
    if(uuid) {
        query = "SELECT * FROM users WHERE uuid=?";
    } else {
        query = "SELECT * FROM users WHERE discord=?";
    }
    var [results] = await pool.query(query, [id]);

    if(results === undefined) return null;

    return results[0];
}
async function fetchUserId(id) {
    var query = `SELECT  * FROM users WHERE id="${id}"`;
    var [results] = await pool.query(query);
    if(!results) return null;
    return results[0];
}

async function createUser(id) {
    var uuid = "unhex(replace(uuid(),'-',''))";
    var query = "INSERT INTO users (uuid_bin, discord) VALUE (?, ?)";
    var [results] = await pool.query(query, [uuid, id]);
    var query2 = "SELECT  * FROM users WHERE id=?";
    var [user] = await pool.query(query2, [results.insertId]);
    return user[0];
}

/**
 * Fetches user from DB.
 * @param {number|string} id to fetch
 * @param {boolean} uuid if in UUID mode
 */
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
    var bbs = user.bbs.toString().padStart(4, "0");
    return insertAt(bbs, ".", bbs.length - 3);
}

async function mine(user) {
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
        await pool.query(
            "UPDATE users SET last_mined=?, bbs=?, xp=? WHERE uuid=?",
            [currentTimestamp, (parseInt(user.bbs) + getLevel(user)), parseInt(user.xp) + getLevel(user), user.uuid]
        );
        return true;
    } else {
        return (oneDay - (now - d));
    }
}

async function pay(src, target, bbs) {
    await pool.query("UPDATE users SET BBS=BBS + ? WHERE id=?", [bbs, target]);
    await pool.query("UPDATE users SET BBS=BBS - ? WHERE id=?", [bbs, src]);
}

async function achievments(id) {
    var query = "SELECT *, u.xp as u_xp FROM users u, achievments_awarded d, achievments a WHERE u.id=? AND d.achievment = a.id AND d.user = u.id ORDER BY d.id DESC";

    var [res] = await pool.query(query, [id]);
    return res;
}

async function awardAchievment(id, code, msg) {
    var query = "INSERT INTO achievments_awarded (user, achievment) VALUES (?, (SELECT id FROM achievments WHERE code=?))";

    var [results] = await pool.query(query, [id, code]);
    var [ac] = pool.query("SELECT * FROM achievments WHERE code=?", [code]);
    var a = ac[0];
    await pool.query("UPDATE users SET bbs = bbs + ?, xp = xp + ? WHERE id = ?", [a.value, a.xp, id]);
    var level = updateLevels(await fetchUserId(id));
    if(level) {
        var [res] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
        levelUp(level, msg, res[0]);
    }
    return results;
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
    pay,
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
