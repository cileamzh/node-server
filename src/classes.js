const mqtt = require("mqtt");
class User {
    uid;
    uname;
    hash;
    identity;
    tel;
    email;
    constructor({ uname, hash, uid, identity, tel, email }) {
        this.uname = uname
        this.uid = uid
        this.hash = hash;
        this.identity = identity;
        this.tel = tel;
        this.email = email;
    }
}

class Device {
    uid;
    did;
    dtype;
    device_name;
    username;
    client_id;
    password;
    host;
    dsid;
    status;
    service_id;
    constructor({ device_name, username, client_id, password, host, dsid, dtype, did, uid, status, service_id }) {
        this.client_id = client_id;
        this.device_name = device_name;
        this.host = host;
        this.username = username;
        this.password = password;
        this.dsid = dsid;
        this.dtype = dtype;
        this.did = did;
        this.uid = uid;
        this.status = status;
        this.service_id = service_id;
    }
}

class DeviceStore {
    dsid;
    uid;
    device_store_name;
    constructor({ uid, device_store_name, dsid }) {
        this.dsid = dsid;
        this.device_store_name = device_store_name;
        this.uid = uid;
    }
}

class DeviceLog {
    did;
    data;
    date;
    constructor({ uid, did, data, date }) {
        this.did = did;
        this.data = data;
        this.date = date;
    }
}

module.exports = { Device, DeviceStore, User, DeviceLog }