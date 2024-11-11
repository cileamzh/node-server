const email = require("nodemailer")
const fs = require("fs");
const path = require("path");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")))
const tranporter = email.createTransport(config.MailSender, () => { })

const send = (to, message) => {
    tranporter.sendMail({
        from: "3177610384@qq.com",
        to,
        subject: "Harmony仓储服务验证码",
        text: "感谢注册用户 您的验证码为:\r\n" + message
    }, (err, info) => {

        console.log(info);
        return true

    })
}

module.exports = send;