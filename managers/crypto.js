const crypto = require("crypto");

function encrypt(text, password, encode = "base64") {
    var cipher = crypto.createCipheriv("aes-256-cbc", password, null);
    var crypted = cipher.update(text, "utf8", encode);
    crypted += cipher.final(encode);
    return crypted;
}

function decrypt(text, password, encode = "base64") {
    var decipher = crypto.createDecipheriv("aes-256-cbc", password, null);
    var dec = decipher.update(text, encode, "utf8");
    dec += decipher.final("utf8");
    return dec;
}

module.exports = {
    encrypt,
    decrypt
};
