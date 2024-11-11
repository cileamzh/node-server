const api = require("express").Router();
const { gCheckCode, gHash, dHash, gToken, dToken } = require("./check");
const {
    get_user_by_eamil,
    get_user_by_uname,
    insert_user,
    insert_device,
    update_user,
    get_devices_by_uid,
    update_device,
    get_user_by_tel,
    get_user_by_uid,
    insert_devicestore,
    get_device_logs,
    get_device,
    get_devicestores,
    del_device,
    del_devicestore,
    get_users,
} = require("./sql");
const send = require("./email");
const { run_device, stop, c_map } = require("./mqtt");
const fs = require("fs");
const path = require("path");
const c_pass = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config.json"))
).console_pass;
const map = new Map();
// 注册接口
api.post("/registry", async (req, res) => {
    const { uname, password, checkcode, tel, email } = req.body;
    if (!checkcode) {
        return res.status(400).json({ message: "验证码不能空" });
    }
    if (!tel) {
        return res.status(400).json({ message: "手机号不能空" });
    }
    if (!password && password.length < 8) {
        return res.status(400).json({ message: "密码不能小于8" });
    }
    if (!uname && uname.length < 1 && uname.match(" ")) {
        return res.status(400).json({ message: "账号不能小于1 且不含空格" });
    }
    if (!email) {
        return res.status(400).json({ message: "邮箱不为空" });
    }
    if (map.get(uname) != checkcode) {
        return res.status(400).json({ message: "验证码错误" });
    }
    if (await get_user_by_uname(uname)) {
        return res.status(400).json({ message: "用户已存在" });
    }
    if (await get_user_by_tel(tel)) {
        return res.status(400).json({ message: "手机号已注册" });
    }
    if (await get_user_by_eamil(email)) {
        return res.status(400).json({ message: "邮箱已注册" });
    }
    insert_user({ uname, hash: gHash(password), identity: "common" });
    return res.json({ message: "注册成功" });
});
// 登录接口
api.post("/login", async (req, res) => {

    const { account, password } = req.body;
    let user = await get_user_by_uname(account);
    if (!user) {
        user = await get_user_by_eamil(account);
    }
    if (!user) {
        user = await get_user_by_tel(account);
    }
    if (!user && Number.parseInt(account) > 100000) {
        user = await get_user_by_uid(Number.parseInt(account));
    }
    if (user == false) {
        return res.status(400).json({ message: "用户不存在" });
    }
    const { uid, hash, identity } = user;
    let r = dHash(password, hash);
    if (!r) {
        return res.status(400).json({ message: "账号或密码错误" });
    }
    return res.json({
        message: "登录成功",
        token: gToken({ uid, identity }, "72h"),
        user
    });
});

// 获取userinfo
api.get("/uinfo", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "token失效" })
    }
    let { uid } = dToken(token);
    let user = await get_user_by_uid(uid);
    return res.json({ message: "获取成功", user })
})

// 获取所有账号接口
api.get("/users", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "token失效" })
    }
    let { identity } = dToken(token);
    if (identity != "manager" && identity != "owner") { return res.status(400).json({ message: "权限不足" }) }
    let users = await get_users(identity);
    return res.json({ message: "获取成功", users })
})

// token登录接口
api.post("/tokenlog", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "token失效" })
    }
    const { uid, identity } = dToken(token);
    let user = await get_user_by_uid(uid);

    return res.json({ message: "登录成功", token: gToken({ uid, identity }, "48h"), user })
})

// 获取验证码接口
api.post("/checkcode", (req, res) => {
    const { uname, email } = req.body;
    if (c_map.has(uname)) { return res.status(400).json({ message: "用户名已被注册" }) }
    if (!uname) { return res.status(400).json({ message: "用户名不能为空" }) }
    let check = gCheckCode();
    map.set(uname, check);
    setTimeout(() => {
        console.log(uname + "的验证码已清除");
        map.delete(uname);
    }, 1000000);
    if (!email) { return res.status(400).json({ message: "邮箱不能为空" }) }
    send(email, check);
    return res.json({ message: "发送成功" });
});
// 上传设备
api.post("/device", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid, identity } = dToken(token);
    if (identity != "manager") {
        return res.status(400).json({ message: "权限不足" });
    }
    const device = req.body;
    device.uid = uid;
    if (identity != "manager") {
        return res.json({ message: "No Power" });
    }
    if (!device.host) {
        return res.json({ message: "host 不能为空" });
    }
    if (!device.client_id) {
        return res.json({ message: "client_id 不能为空" });
    }
    device.status = 0
    insert_device(device);
    return res.json({ message: "添加成功" });
});

// 获取用户所有设备
api.get("/devices", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    let devices = await get_devices_by_uid(uid);
    return res.json({ message: "获取成功", devices })
})

// 获取指定设备
api.get("/device/:did", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { did } = req.params
    if (typeof parseInt(did) != "number") {
        return res.status(400).json({ message: "请发送正确的did" })
    }
    const { uid } = dToken(token);
    let device = await get_device(uid, parseInt(did));
    if (!device) { return res.status(400).json({ message: "未找到设备" }) }
    return res.json({ message: "获取设备成功", device })
})
// 上传仓库
api.post("/devicestore", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid, identity } = dToken(token);
    if (identity != "manager") {
        return res.status(400).json({ message: "权限不足" });
    }
    const { device_store_name } = req.body;
    insert_devicestore(uid, { device_store_name });
});

// 获取指定仓库
api.get("/devicestore/:dsid", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { dsid } = req.params;
    if (typeof parseInt(dsid) != "number") {
        return res.status(400).json({ message: "请发送正确的did" })
    }
    let devicestores = await get_devicestores(uid);
    if (!devicestores) { return res.status(400).json({ message: "仓库不存在" }) }
    devicestores.forEach((devicestore) => {
        if (devicestore.dsid == dsid) {
            return res.json({ message: "获取成功", devicestore })
        }
    })
    return res.status(400).json({ message: "仓库不存在" })
});

// 获取所有仓库
api.get("/devicestores", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    let devicestores = await get_devicestores(uid);
    if (!devicestores) { return res.status(400).json({ message: "尚未创建仓库" }) }
    return res.json({ message: "获取成功", devicestores })
})

// 删除仓库接口
api.get("/devicestore/delete/:dsid", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { dsid } = req.params
    if (typeof parseInt(dsid) != "number") {
        return res.status(400).json({ message: "请发送正确的dsid" })
    }
    let r = await del_devicestore(uid, parseInt(dsid));
    return res.json({ message: "删除成功" })
})

// 删除设备接口
api.get("/device/delete/:did", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { did } = req.params
    if (typeof parseInt(did) != "number") {
        return res.status(400).json({ message: "请发送正确的did" })
    }
    let r = await del_device(uid, parseInt(did));
    return res.json({ message: "删除成功" })
})
// 设置用户属性接口
api.post("/upuser", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { password, uname } = req.body;
    if (password) {
        update_user({ hash: gHash(password) }, uid);
    }
    if (uname) {
        if (!(await get_user_by_uname(uname))) {
            update_user({ uname }, uid);
        } else {
            return res.status(400).json({ meassage: "uname exists" });
        }
    }
    return res.json({ message: "更新成功" });
});

// 忘记密码接口
api.post("/fpassword", (req, res) => {
    const { checkcode, uname, uid, npassword } = req.body;
    res.status(400);
});

// 控制台
api.get("/console", (req, res) => {
    if (req.query.pass != c_pass && !req.query.pass) {
        return res.send("NO PASS");
    }
    let cl = [];
    map.forEach((v, k) => {
        cl.push(k + " : " + v);
    });
    return res.send(cl);
});

// 设制设备接口
api.post("/device/set", async (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid, identity } = dToken(token);
    if (identity != "manager") {
        return res.status(400).json({ message: "权限不足" });
    }
    const {
        status,
        did,
        device_name,
        dsid,
        host,
        client_id,
        password,
        username,
        dtype,
        service_id
    } = req.body;
    let devices = await get_devices_by_uid(uid);
    if (!devices) {
        return res.status(400).json({ message: "你未拥有设备" });
    }
    devices.forEach((dc) => {
        if ((dc.did = did)) {
            if (device_name) {
                update_device(uid, did, { device_name });
            }
            if (status) {
                update_device(uid, did, { status });
            }
            if (dsid) {
                update_device(uid, did, { dsid });
            }
            if (host) {
                update_device(uid, did, { host });
            }
            if (client_id) {
                update_device(uid, did, { client_id });
            }
            if (password) {
                update_device(uid, did, { password });
            }
            if (username) {
                update_device(uid, did, { username });
            }
            if (dtype) {
                update_device(uid, did, { dtype });
            }
            if (service_id) {
                update_device(uid, did, { service_id })
            }
        }
    });
    return res.json({ message: "更新成功" });
});

// 运行设备接口
api.get("/device/run/:did", async (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { did } = req.params;
    if (!did && typeof did != "number") {
        return res.status(400).json({ message: "did 不能为空且必须为数字" })
    }
    let device = await get_device(uid, did);
    if (!device) {
        return res.status(400).json({ message: "未找到设备" });
    }
    run_device(device);
    update_device(uid, did, { status: 1 });
    return res.json({ message: "设备已启动" });


});

// 关闭设备接口
api.get("/device/stop/:did", async (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    const { did } = req.params;
    if (!did && typeof did != "number") {
        return res.status(400).json({ message: "did 不能为空且必须为数字" })
    }
    let device = await get_device(uid, parseInt(did));
    if (!device) {
        return res.status(400).json({ message: "未找到设备" });
    }
    if (!stop(did)) {
        return res.json({ message: "设备未运行" })
    };
    update_device(uid, did, { status: 0 });
    return res.json({ message: "设备已停止" });
});

// 获取运行日志接口
api.get("/device_logs/:did", async (req, res) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(400).json({ message: "未找到token 请先登录" });
    }
    if (!dToken(token)) {
        return res.status(400).json({ message: "bad token" });
    }
    const { uid } = dToken(token);
    let device = await get_device(uid, parseInt(req.params.did));
    if (!device) {
        return res.status(400).json({ message: "未找到设备" })
    }
    let device_logs = await get_device_logs(device.did)
    return res.json({ message: "获取成功", device_logs })
})
module.exports = api;
