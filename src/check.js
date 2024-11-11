const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const JWTSK = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"))).JWTSK;
const saltRound = 10;

// Token生成函数
function gToken(user, ctime) {
    return jwt.sign(user, JWTSK, { expiresIn: ctime == null ? "1h" : ctime });
}
// Token解密函数
function dToken(token) {
    let decoder = false;
    jwt.verify(token, JWTSK, (err, decode) => {
        if (!err) {
            decoder = decode
        }
    })
    return decoder
}
// Hash生成函数
const gHash = (data) => {
    const s = bcrypt.genSaltSync(saltRound);
    const hash = bcrypt.hashSync(data, s);
    return hash
}
// Hash判断函数
const dHash = (data, hash) => {
    return bcrypt.compareSync(data, hash);
}
// 随机验证码函数
function gCheckCode(length = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let checkCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);  // 获取随机索引
        checkCode += characters[randomIndex];  // 将随机字符添加到验证码字符串
    }
    return checkCode;
}



module.exports = { dHash, gHash, gToken, dToken, gCheckCode }