const os = require("os");
const { spawn } = require("child_process");

class nodeNetworkManager {
  constructor() {}

  getIPv4() {
    return new Promise((resolve, reject) => {
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
  }
  getHostName() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["general", "hostname"]);
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        // nmcli.on("close", (code) => {});
      } catch (error) {
        reject(error);
      }
    });
  }
  enable() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["networking", "on"]);
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  disable() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["networking", "off"]);
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getNetworkConnectivityState(reChecking = false) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn(
          "nmcli",
          reChecking
            ? ["networking", "connectivity", "check"]
            : ["networking", "connectivity"]
        );
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  wifiEnable() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["radio", "wifi", "on"]);
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  wifiDisable() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["radio", "wifi", "off"]);
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getWifiStatus() {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["radio", "wifi"]);
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  activityMonitor(stream) {
    return new Promise((resolve, reject) => {
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
  }
  getConnectionProfilesList(active = false) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn(
          "nmcli",
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
            : [
                "-m",
                "multiline",
                "connection",
                "show",
                "--order",
                "active:name",
              ]
        );
        let body = [];
        nmcli.stdout.on("data", (data) => {
          body.push(data);
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          try {
            if (code !== 0) return reject(`error code : ${code}`);

            resolve(this.#stringToJson(body.join("")));
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  connectionUp(uuid) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["connection", "up", String(uuid)]);
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {});
      } catch (error) {
        reject(error);
      }
    });
  }
  connectionDown(uuid) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", ["connection", "down", String(uuid)]);
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {});
      } catch (error) {
        reject(error);
      }
    });
  }
  getWifiList(reScan = false) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn(
          "nmcli",
          reScan
            ? ["-m", "multiline", "device", "wifi", "list", "--rescan", "yes"]
            : ["-m", "multiline", "device", "wifi", "list", "--rescan", "no"]
        );
        let body = [];
        nmcli.stdout.on("data", (data) => {
          body.push(data);
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {
          try {
            if (code !== 0) return reject(`error code : ${code}`);

            resolve(this.#stringToJson(body.join("")));
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  wifiConnect(ssid, password) {
    return new Promise((resolve, reject) => {
      try {
        const nmcli = spawn("nmcli", [
          "device",
          "wifi",
          "connect",
          String(ssid),
          "password",
          String(password),
        ]);
        nmcli.stdout.on("data", (data) => {
          resolve(data.toString());
        });
        nmcli.stderr.on("data", (data) => {
          reject(data.toString());
        });
        nmcli.on("close", (code) => {});
      } catch (error) {
        reject(error);
      }
    });
  }

  #stringToJson(stringData) {
    const data = stringData
      .toString()
      .replace(/ /g, "")
      .split("\n")
      .map((keyVal) => {
        const index = keyVal.indexOf(":");
        const obj = {};
        obj[keyVal.slice(0, index)] = keyVal.slice(index + 1);
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
  }
}

module.exports = nodeNetworkManager;
