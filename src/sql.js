const { Client } = require("pg");
const { select_sql, insert_sql, update_sql } = require("./tosql");
const { Device, User, DeviceLog, DeviceStore } = require("./classes");
let client = new Client({
    user: "system",
    password: "zxc005921",
    host: "localhost",
    port: 54321,
    database: "harmony",
});
client.connect();

// 判断用户是否存在
let get_user_by_uname = async (uname) => {
    let rs = await client.query(select_sql("user", "*", { uname }));
    return rs.rows.length == 0 ? false : new User(rs.rows[0]);
};

let get_user_by_tel = async (tel) => {
    let rs = await client.query(select_sql("user", "*", { tel }))
    return rs.rows.length == 0 ? false : new User(rs.rows[0]);
}

let get_user_by_uid = async (uid) => {
    let rs = await client.query(select_sql("user", "*", { uid }));
    return rs.rows.length == 0 ? false : new User(rs.rows[0]);
};

let get_user_by_eamil = async (email) => {
    let rs = await client.query(select_sql("user", "*", { email }));
    return rs.rows.length == 0 ? false : new User(rs.rows[0]);
}

// 添加user
let insert_user = async (user) => {
    let rs = await client.query(insert_sql("user", user));
    return rs.command;
};
//添加设备
let insert_device = async (device) => {
    let rs = await client.query(insert_sql("device", device));
    return rs.command;
};

let update_user = async (user, uid) => {
    let rs = await client.query(update_sql("user", user, { uid }));
    return rs.command;
};

let get_devices_by_uid = async (uid) => {
    let rs = await client.query(select_sql("device", "*", { uid }));
    let r = []
    rs.rows.forEach((device) => {
        r.push(new Device(device))
    });
    if (r.length > 0) { return r; } else { return false }
};

let insert_device_log = async (device_log) => {
    let rs = await client.query(insert_sql("device_log", device_log))
    return rs.command;
}

let get_devices_by_uid_and_dsid = async (uid, dsid) => {
    let rs = await client.query(select_sql("device", "*", { uid, dsid }));
    let r = []
    rs.rows.forEach((d) => {
        r.push(new Device(d))
    });
    if (r.length >= 0) { return r; } else { return null }
};

let get_device = async (uid, did) => {
    let rs = await client.query(select_sql("device", "*", { uid, did }))
    if (rs.rowCount == 1) { return new Device(rs.rows[0]) } else { return null }
}

let del_device = async (uid, did) => {
    let rs = await client.query(`delete from "device" where "uid"='${uid}' and "did"='${did}'`)
    return rs.command;
}

let update_device = async (uid, did, device) => {
    let rs = await client.query(update_sql("device", device, { uid, did }))
    return rs.command;
}

let get_users = async (identity) => {
    let rs;
    if (identity == "manager") {
        rs = await client.query(select_sql("user", "*", { identity: "common" }));
    }
    if (identity == "owner") {
        rs = await client.query(select_sql("user", "*", {}));
    }
    return rs.rows
}

let get_devicestores = async (uid) => {
    let rs = await client.query(select_sql("devicestore", "*", { uid }));
    let r = []
    rs.rows.forEach((v) => {
        r.push(new DeviceStore(v));
    })
    return r.length == 0 ? false : r;
}

let insert_devicestore = async (uid, devicestore) => {
    let rs = await client.query(insert_sql("devicestore", devicestore, { uid }));
    return rs.command;
}

let get_device_logs = async (did) => {
    let rs = await client.query(select_sql("device_log", "*", { did }));
    let r = [];
    rs.rows.forEach((v) => {
        r.push(new DeviceLog(v))
    })
    return rs.rows.length == 0 ? null : r;
}

let del_devicestore = async (uid, did) => {
    let rs = await client.query(`delete from "devicestore" where "uid"='${uid}' and "did"='${did}'`)
    return rs;
}


let delete_user = async (uid) => {
    let rs = await client.query(`delete from "user" where "uid"='${uid}'`);
    return rs.command
}

module.exports = {
    get_user_by_eamil,
    get_user_by_tel,
    get_user_by_uname,
    insert_user,
    insert_device,
    get_user_by_uid,
    update_user,
    get_devices_by_uid,
    get_devices_by_uid_and_dsid,
    get_device,
    update_device,
    insert_devicestore,
    insert_device_log,
    get_device_logs,
    get_devicestores,
    del_device,
    del_devicestore,
    get_users,
    delete_user,
};  