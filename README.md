# node-network-manager

[![npm version](https://badge.fury.io/js/node-network-manager.svg)](https://www.npmjs.com/package/node-network-manager)

## Descreption

Network Setting and Get Network Info (IP, Lan, Wifi and ...)

## Note

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

1. This package works only `linux` based systems (linux on PC, Raspberry-pi, Orange-pi and ...)
2. This package required to `nmcli` (`network-manager`)

- [Install `NetworkManager` on Ubuntu](https://help.ubuntu.com/community/NetworkManager)
- [`nmcli` Document](https://developer-old.gnome.org/NetworkManager/stable/nmcli.html)

## Installation

### npm

```bash
npm install node-network-manager --save
```

### Usage

app.js

```javascript
const network = require("node-network-manager");

network
  .getConnectionProfilesList()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

### Examples

1- Enable network

```javascript
network
  .enable()
  .then(() => console.log("network has just turned on"))
  .catch((error) => console.log(error));
```

2- Disable network

```javascript
network
  .disable()
  .then(() => console.log("network has just turned off"))
  .catch((error) => console.log(error));
```

3- Get network connectivity state

```javascript
network
  .getNetworkConnectivityState()
  .then((hostName) => console.log(hostName))
  .catch((error) => console.log(error));
```

4- Enable Wifi

```javascript
network
  .wifiEnable()
  .then(() => console.log("wifi was enabled"))
  .catch((error) => console.log(error));
```

5- Disable Wifi

```javascript
network
  .wifiDisable()
  .then(() => console.log("wifi was disabled"))
  .catch((error) => console.log(error));
```

6- Get Wifi status

```javascript
network
  .getWifiStatus()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

7- Observe NetworkManager activity. Watches for changes in connectivity state, devices or connection profiles.

```javascript
const fs = require("fs");
const path = require("path");
const myFile = fs.createWriteStream(path.join(__dirname, "myOutput.txt"));
network
  .activityMonitor(process.stdout)
  .then((endStream) => {
    console.log("start monitor");
    setTimeout(() => {
      console.log("stop monitor");
      endStream();
    }, 5000);
  })
  .catch((error) => console.log(error));
network
  .activityMonitor(myFile)
  .then((endStream) => {
    console.log("start monitor");
    setTimeout(() => {
      console.log("stop monitor");
      endStream();
    }, 5000);
  })
  .catch((error) => console.log(error));
```

8- List in-memory and on-disk connection profiles,

```javascript
network
  .getConnectionProfilesList()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

9- Activate a connection

```javascript
network
  .connectionUp("79373ad4-c462-43f7-90bd-ffdd4036623f")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

10- Deactivate a connection from a device without preventing the device from further auto-activation.

```javascript
network
  .connectionDown("79373ad4-c462-43f7-90bd-ffdd4036623f")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

11- List available Wi-Fi access points.

```javascript
network
  .getWifiList(true)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

12- Connect to a Wi-Fi network specified by SSID

```javascript
network
  .wifiConnect("Your-Access-Point-SSId", "AP-Password")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

13- Get all IPv4 interfaces

```javascript
network
  .getIPv4()
  .then((ipData) => console.log(ipData))
  .catch((error) => console.log(error));
```

14- Get system hostname

```javascript
network
  .getHostName()
  .then((hostName) => console.log(hostName))
  .catch((error) => console.log(error));
```

## License

This project is licensed under the MIT License

## Change log

### 1.0.0 (2021-09-26)

- Release first version
