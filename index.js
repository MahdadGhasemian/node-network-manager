const os = require("os");
const { spawn } = require("child_process");

// collect ip4 addresses using "os" module
const getIPv4 = () =>
  new Promise((resolve, reject) => {
    try {
      const networkInterfaces = os.networkInterfaces();
      let items = [];
      for (const key in networkInterfaces) {
        if (Object.hasOwnProperty.call(networkInterfaces, key)) {
          const element = networkInterfaces[key];
          for (const item of element) {
            if (!item.internal && item.family === "IPv4")
              items.push({
                address: item.address,
                netmask: item.netmask,
                mac: item.mac,
              });
          }
        }
      }
      resolve(items);
    } catch (error) {
      reject(error);
    }
  });

// stringToJson convertor
const stringToJson = (stringData) => {
  const data = stringData
    .toString()
    .split("\n")
    .map((keyVal) => {
      const index = keyVal.indexOf(":");
      const obj = {};
      obj[keyVal.slice(0, index)] = keyVal.slice(index + 1).replace(/^ */, "");
      return obj;
    });
  const firstKey = Object.keys(data[0])[0];
  let i = 1;
  for (i = 1; i < data.length; i++) {
    const element = Object.keys(data[i])[0];
    if (element === firstKey) {
      break;
    }
  }

  let list = [];
  for (let index = 0; index < data.length; index += i) {
    let obj = {};
    data.slice(index, index + i).forEach((item) => {
      const key = Object.keys(item)[0];
      if (key) obj[key] = item[key];
    });
    if (!!Object.keys(obj).length) list.push(obj);
  }

  return list;
};

// nmcli request for single answer or without answer
const cli = (args) =>
  new Promise((resolve, reject) => {
    let resolved = false;
    try {
      const nmcli = spawn("nmcli", args);
      nmcli.stdout.on("data", (data) => {
        if (resolved) return;
        resolved = true;
        resolve(data.toString().trim());
      });
      nmcli.stderr.on("data", (data) => {
        if (resolved) return;
        resolved = true;
        reject(data.toString().trim());
      });
      nmcli.on("close", (code) => {
        if (resolved) return;
        resolved = true;
        resolve(code);
      });
    } catch (err) {
      if (resolved) return;
      resolved = true;
      reject(err);
    }
  });

// nmcli request for multiline answer
const clib = (args) =>
  new Promise((resolve, reject) => {
    let resolved = false;
    try {
      const nmcli = spawn("nmcli", args);
      const body = [];
      nmcli.stdout.on("data", (data) => {
        body.push(data);
      });
      nmcli.stderr.on("data", (data) => {
        if (resolved) return;
        resolved = true;
        reject(data.toString());
      });
      nmcli.on("close", (code) => {
        if (resolved) return;
        resolved = true;
        try {
          if (code !== 0) return reject(code);
          resolve(stringToJson(body.join("")));
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });

// activity monitor stream
const activityMonitor = (stream) =>
  Promise((resolve, reject) => {
    try {
      const nmcli = spawn("nmcli", ["monitor"]);
      nmcli.stdout.pipe(stream, { end: false });

      function endStream() {
        nmcli.kill("SIGHUP");
      }

      resolve(endStream);
    } catch (error) {
      reject(error);
    }
  });

// hostname
const getHostName = () => cli(["general", "hostname"]);
const setHostName = (hostName) =>
  cli(["general", "hostname", String(hostName)]);
// networking
const enable = () => cli(["networking", "on"]);
const disable = () => cli(["networking", "off"]);
const getNetworkConnectivityState = (reChecking = false) =>
  cli(
    reChecking
      ? ["networking", "connectivity", "check"]
      : ["networking", "connectivity"]
  );
// connections (profiles)
const connectionUp = (profile) => cli(["connection", "up", String(profile)]);
const connectionDown = (profile) =>
  cli(["connection", "down", String(profile)]);
const connectionDelete = (profile) =>
  cli(["connection", "delete", String(profile)]);
const getConnectionProfilesList = (active = false) =>
  clib(
    active
      ? [
          "-m",
          "multiline",
          "connection",
          "show",
          "--active",
          "--order",
          "active:name",
        ]
      : ["-m", "multiline", "connection", "show", "--order", "active:name"]
  );
// devices
const deviceConnect = (device) => cli(["device", "connect", String(device)]);
const deviceDisconnect = (device) =>
  cli(["device", "disconnect", String(device)]);
const deviceStatus = async () => {
  const data = await clib(["device", "status"]);
  return Object.keys(data[0])
    .map((line) => {
      if (line.startsWith("DEVICE")) return null; // filter first line
      const lines = line
        .replaceAll(/\s{2,}/g, " ")
        .trim()
        .split(" ");
      const ret = {};
      ret.device = lines.shift();
      ret.type = lines.shift();
      ret.state = lines.shift();
      ret.connection = lines.join(" ");
      return ret;
    })
    .filter((x) => !!x); // filter first line
};
const getDeviceInfoIPDetail = async (deviceName) => {
  const statesMap = {
    10: "unmanaged",
    30: "disconnected",
    100: "connected",
  };
  const data = await clib(["device", "show", String(deviceName)]);
  return data.map((item) => {
    const state = parseInt(item["GENERAL.STATE"]) || 10; // unmanaged by default
    return {
      device: item["GENERAL.DEVICE"],
      type: item["GENERAL.TYPE"],
      state: statesMap[state],
      connection: item["GENERAL.CONNECTION"],
      mac: item["GENERAL.HWADDR"],
      ipV4: item["IP4.ADDRESS[1]"]?.replace(/\/[0-9]{2}/g, ""),
      netV4: item["IP4.ADDRESS[1]"],
      gatewayV4: item["IP4.GATEWAY"],
      ipV6: item["IP6.ADDRESS[1]"]?.replace(/\/[0-9]{2}/g, ""),
      netV6: item["IP6.ADDRESS[1]"],
      gatewayV6: item["IP6.GATEWAY"],
    };
  })[0];
};
const getAllDeviceInfoIPDetail = async () => {
  const statesMap = {
    10: "unmanaged",
    30: "disconnected",
    100: "connected",
  };
  const data = await clib(["device", "show"]);
  return data.map((item) => {
    const state = parseInt(item["GENERAL.STATE"]) || 10; // unmanaged by default
    return {
      device: item["GENERAL.DEVICE"],
      type: item["GENERAL.TYPE"],
      state: statesMap[state],
      connection: item["GENERAL.CONNECTION"],
      mac: item["GENERAL.HWADDR"],
      ipV4: item["IP4.ADDRESS[1]"]?.replace(/\/[0-9]{2}/g, ""),
      netV4: item["IP4.ADDRESS[1]"],
      gatewayV4: item["IP4.GATEWAY"],
      ipV6: item["IP6.ADDRESS[1]"]?.replace(/\/[0-9]{2}/g, ""),
      netV6: item["IP6.ADDRESS[1]"],
      gatewayV6: item["IP6.GATEWAY"],
    };
  });
};

// wifi
const wifiEnable = () => cli(["radio", "wifi", "on"]);
const wifiDisable = () => cli(["radio", "wifi", "off"]);
const getWifiStatus = () => cli(["radio", "wifi"]);
const wifiHotspot = async (ifname, ssid, password) =>
  clib([
    "device",
    "wifi",
    "hotspot",
    "ifname",
    String(ifname),
    "ssid",
    ssid,
    "password",
    password,
  ]);

const wifiCredentials = async (ifname) => {
  if (!ifname) throw Error("ifname required!");
  const data = await clib([
    "device",
    "wifi",
    "show-password",
    "ifname",
    ifname,
  ]);
  return data[0];
};

const getWifiList = async (reScan = false) => {
  const data = await clib(
    reScan
      ? ["-m", "multiline", "device", "wifi", "list", "--rescan", "yes"]
      : ["-m", "multiline", "device", "wifi", "list", "--rescan", "no"]
  );
  return data.map((el) => {
    let o = Object.assign({}, el);
    o.inUseBoolean = o["IN-USE"] === "*";
    return o;
  });
};

const wifiConnect = (ssid, password, hidden = false) => {
  if (!hidden) {
    cli([
      "device",
      "wifi",
      "connect",
      String(ssid),
      "password",
      String(password),
    ]);
  } else {
    cli([
      "device",
      "wifi",
      "connect",
      String(ssid),
      "password",
      String(password),
      "hidden",
      "yes"
    ]);
  }
};

// exports
module.exports = {
  getIPv4,
  activityMonitor,
  // hostname
  getHostName,
  setHostName,
  // network
  enable,
  disable,
  getNetworkConnectivityState,
  // connection (profile)
  connectionUp,
  connectionDown,
  connectionDelete,
  getConnectionProfilesList,
  // device
  deviceStatus,
  deviceConnect,
  deviceDisconnect,
  getDeviceInfoIPDetail,
  getAllDeviceInfoIPDetail,
  // wifi
  wifiEnable,
  wifiDisable,
  getWifiStatus,
  wifiHotspot,
  wifiCredentials,
  getWifiList,
  wifiConnect,
};
