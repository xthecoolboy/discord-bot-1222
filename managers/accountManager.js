const pool = require("./pool_mysql");
const { padWithZeroes, insertAt } = require("../utils");
const newEmbed = require("../embed");

function getUser(id, uuid = false){
    return new Promise(function(resolve, reject){
        if (uuid) {
            var query = `SELECT  * FROM users WHERE uuid="${id}"`;
        } else {
            var query = `SELECT  * FROM users WHERE discord="${id}"`;
        }
        pool.query(query, function(error, results, fields){
            if (error) reject(error);
            resolve(results[0]);
        })
    })
}
function fetchUserId(id){
    return new Promise(function (resolve, reject) {
        var query = `SELECT  * FROM users WHERE id="${id}"`;
        pool.query(query, function (error, results, fields) {
            if (error) reject(error);
            resolve(results[0]);
        })
    })
}

function createUser(id){
    return new Promise(function (resolve, reject) {
        var uuid = "unhex(replace(uuid(),'-',''))";
        var query = `INSERT INTO users (uuid_bin, discord) VALUE (${uuid}, ${id})`;
        pool.query(query, function (error, results, fields) {
            if (error) return reject(error);
            var query2 = `SELECT  * FROM users WHERE id="${results.insertId}"`;
            pool.query(query2, (error, results, fields)=>{
                if(error) return reject(error);
                resolve(results[0]);
            })
        })
    })
}

async function fetchUser(id, uuid = false){
    var user = await getUser(id, uuid);
    if(!user && !uuid){
        user = await createUser(id);
    } else if(!user){
        user = undefined;
    }
    return user;
}
async function fetchUserUUID(id) {
    return await fetchUser(id, true);
}

var xp_breakpoints = [];

function xp(){
    var baseXP = 15;
    var numlevels = 150;
    var tempXP = 0;

    for (var level = 0; level < numlevels; level++) {
        tempXP = baseXP * (level * (level - 1) / 2);
        xp_breakpoints[level] = tempXP;
    }
    
}; 
xp();
xp_breakpoints.shift();// remove -0

function getLevel(user){
    var i = 0;
    var minDiff = 1000;
    var ans;

    for (i in xp_breakpoints) {
        var m = Math.abs(user.xp - xp_breakpoints[i]);
        if (m < minDiff) {
            minDiff = m;
            ans = i;
        }
    }

    return parseInt(ans) + 1;
}
function getNextLevel(xp){

    var i = 0;
    var minDiff = 1000;
    var ans;

    for (i in xp_breakpoints) {
        var m = Math.abs(xp - xp_breakpoints[i]);
        if (m < minDiff) {
            minDiff = m;
            ans = xp_breakpoints[i];
        }
    }

    return parseInt(ans) + 1;
}

function getMoney(user){
    var bbs = padWithZeroes(user.bbs, 4);
    return insertAt(bbs, '.', bbs.length - 3) + " BBS";
}

function mine(user){
    return new Promise((resolve, reject)=>{
        try {
            var t = user.last_mined.split(/[- :]/);
            var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
        } catch(e){
            var d = user.last_mined;
        }

        var now = new Date;
        const oneDay = 60 * 60 * 12 * 1000;
        var canMine = (now - d) > oneDay;
        
        if(canMine){
            var current_timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            pool.query(`UPDATE users SET last_mined="${current_timestamp}", bbs="${parseInt(user.bbs) + getLevel(user)}", xp="${parseInt(user.xp) + getLevel(user)}" WHERE uuid="${user.uuid}"`, (err)=>{
                if(err)return reject(err);
                resolve(parseInt(user.bbs) + getLevel(user));
            });
        } else {
            resolve(false);
        }
    })
}

function achievments(id){
    return new Promise(function (resolve, reject) {
        
        var query = `SELECT  * FROM users u, achievments_awarded d, achievments a WHERE u.id="${id}" AND d.achievment = a.id AND d.user = u.id ORDER BY d.id DESC`;

        pool.query(query, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        })
    })
}

function awardAchievment(id, code, msg){
    return new Promise(function (resolve, reject) {

        var query = `INSERT INTO achievments_awarded (user, achievment) VALUES (${id}, (SELECT id FROM achievments WHERE code='${code}'))`;

        pool.query(query, function (error, results, fields) {
            if (error) reject(error);
            pool.query("SELECT * FROM achievments WHERE code='" + code + "'", (er, ac, fi)=>{
                if (er) reject(er);
                var a = ac[0];
                pool.query(`UPDATE users SET bbs = bbs + ${a.value}, xp = xp + ${a.xp} WHERE id = ${id}`, async(e, res, f)=>{
                    if (e) reject(e);
                    var level = updateLevels(await fetchUserId(id));
                    if(level){
                        pool.query(`SELECT * FROM users WHERE id=${id}`, (erro, res)=>{
                            if (erro) reject(erro);
                            levelUp(level, msg, res[0]);
                            resolve(results);
                        })
                    } else {
                        resolve(results);
                    }
                })
            })
        })
    })
}

function levelUp(level, msg, user){
    var embed = newEmbed();
    embed.setTitle(msg.author.username + " leveled up! ");
    embed.setDescription("Current level is " + level + ". XP points owned: " + user.xp + " / " + getNextLevel(user.xp));
    msg.channel.send(embed);
}

function sendAchievment(a, msg, send = true){
    var embed = newEmbed();
    var user = msg.author;
    embed.setTitle((send ? "Achievment Awarded: " : "") + a.name);
    embed.setDescription(a.description);
    embed.setAuthor(user.username + "#" + user.discriminator, user.avatarURL);
    embed.addField("BBS", a.value, true);
    embed.addField("XP", a.xp, true);
	embed.setTimestamp()

    return embed;
}

async function sendAchievmentUnique(msg, code){
    var id = await fetchUser(msg.author.id);
    id = id.id;
    var achievmentsAwarded = await achievments(id);
    var hasNSFW = false;
    achievmentsAwarded.forEach((a) => {
        if (a.code == code) hasNSFW = true;
    });
    if (!hasNSFW) {
        awardAchievment(id, code, msg);
        achievmentsAwarded = await achievments(id);
        msg.channel.send(sendAchievment(achievmentsAwarded[0], msg));
    }
}

function updateLevels(user){
    var level = getLevel(user);
    if(user.last_level != level){
        pool.query("UPDATE users SET last_level = " + level + " WHERE id = " + user.id, (e)=>{if(e)throw e;});
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
};