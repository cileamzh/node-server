const express = require("express");
const api = require("./api");
const fs = require("fs");
const path = require("path");
let server = express();
server.use(express.json());

process.on('uncaughtException', (err, origin) => {
    console.error(`未捕获的异常: ${err.message}`);
    console.error(err.stack);
    // 根据需要决定是否重启应用
    // 例如：process.exit(1); 退出进程，或重启服务器
});

// 捕获未处理的 Promise 异常
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 错误:', reason);
    // 同样根据需要决定是否退出或重启
});

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"))
})
server.use("/", express.static(path.join(__dirname, "../static")))

server.use("/api", api);

server.listen(80, () => {
    console.log("server runnig in localhost:80");
});
