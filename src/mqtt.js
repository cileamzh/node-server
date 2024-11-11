const mqtt = require("mqtt");
const { Device } = require("./classes");
const { insert_device_log } = require("./sql");
const fs = require("fs");
const path = require("path");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")))
const c_map = new Map();
/**
 * 
 * @param {Device} device 
 */
let run_device = (device) => {
    const { username, password, client_id, did, service_id, host } = device;
    let client = mqtt.connect(host, {
        username, password, clientId: client_id
    });
    client.on("connect", () => {
        client.subscribe(`$oc/devices/${username}/sys/shadow/get/response/#`, (err) => {
            client.publish(`$oc/devices/${username}/sys/shadow/get/request_id=${did}`, JSON.stringify({ service_id }))
        });
    })
    setInterval(() => {
        client.publish(`$oc/devices/${username}/sys/shadow/get/request_id=${did}`, JSON.stringify({ service_id }))
    }, config.refresh_time)
    client.on("message", (topic, message) => {
        let m = JSON.parse(message).shadow[0].reported
        insert_device_log({ data: JSON.stringify(m.properties), date: convertToLongTimestampInCST(m.event_time), did })
    })
    c_map.set("did" + did, client);

}
/**
 * 
 * @param {number} did 
 */
let stop = (did) => {
    if (!c_map.has("did" + did)) {
        return false
    }
    let c = c_map.get("did" + did);
    c.end();
    c_map.delete("did" + did)
    return true
}

function convertToLongTimestampInCST(dateString) {
    // 将格式化的字符串转换为标准的 ISO 8601 日期格式
    const formattedDateString = dateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');

    // 创建 Date 对象（注意这是 UTC 时间）
    const date = new Date(formattedDateString);

    // 获取该时间在中国时区的时间戳，CST (UTC+8)
    const cstTime = date.getTime() + (8 * 60 * 60 * 1000);  // UTC+8
    return cstTime;
}

module.exports = { run_device, c_map, stop };
