# node-network-manager

[![npm version](https://badge.fury.io/js/node-network-manager.svg)](https://www.npmjs.com/package/node-network-manager)

## Descreption

Network Setting and Get Network Info (IP, Lan, Wifi and ...)

## Notes

```diff
- This package works only `linux` based systems
+ linux on PC, Raspberry-pi, Orange-pi and ...
- This package required to `nmcli` (`network-manager`)
```

- [Install NetworkManager on Ubuntu](https://help.ubuntu.com/community/NetworkManager)
- [nmcli Document](https://developer-old.gnome.org/NetworkManager/stable/nmcli.html)

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

## Examples

#### Enable network

```javascript
network
  .enable()
  .then(() => console.log("network has just turned on"))
  .catch((error) => console.log(error));
```

#### Disable network

```javascript
network
  .disable()
  .then(() => console.log("network has just turned off"))
  .catch((error) => console.log(error));
```

#### Get network connectivity state (params: reChecking = true|false)

```javascript
network
  .getNetworkConnectivityState(true)
  .then((hostName) => console.log(hostName))
  .catch((error) => console.log(error));
```

#### Get Device Status

```javascript
network
  .deviceStatus()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

#### Connect Device (params: device (can get with deviceStatus))

```javascript
network
  .deviceStatus("enp4s0")
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

#### Disconnect Device (params: device (can get with deviceStatus))

```javascript
network
  .deviceStatus("enp4s0")
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

#### Enable Wifi

```javascript
network
  .wifiEnable()
  .then(() => console.log("wifi was enabled"))
  .catch((error) => console.log(error));
```

#### Disable Wifi

```javascript
network
  .wifiDisable()
  .then(() => console.log("wifi was disabled"))
  .catch((error) => console.log(error));
```

#### Get Wifi status

```javascript
network
  .getWifiStatus()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Wifi Hotspot (params: ifname (interface name like: wlo1, enp4s0) , ssid , password)

```javascript
network
  .wifiHotspot("wlo1", "ssid1988", "1234567890")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Get Wifi credentials (params: ifname (interface name like: wlo1, enp4s0))

```javascript
network
  .wifiCredentials("wlo1")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Observe NetworkManager activity. Watches for changes in connectivity state, devices or connection profiles. (params: stream = stream)

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

#### List in-memory and on-disk connection profiles (params: active = true|false)

```javascript
network
  .getConnectionProfilesList()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Activate a connection (params: uuid (can get with getConnectionProfilesList))

```javascript
network
  .connectionUp("79373ad4-c462-43f7-90bd-ffdd4036623f")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Deactivate a connection from a device without preventing the device from further auto-activation. (params: uuid (can get with getConnectionProfilesList))

```javascript
network
  .connectionDown("79373ad4-c462-43f7-90bd-ffdd4036623f")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### List available Wi-Fi access points. (params: reScan = true|false)

```javascript
network
  .getWifiList(true)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Connect to a Wi-Fi network specified by SSID (params: SSID = String , Password = String)

```javascript
network
  .wifiConnect("Your-Access-Point-SSId", "AP-Password")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Support for hidden WiFi (v1.0.11) _(new)_

```javascript
network
  .wifiConnect("Your-Access-Point-SSId", "AP-Password", true)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Get all IPv4 interfaces

```javascript
network
  .getIPv4()
  .then((ipData) => console.log(ipData))
  .catch((error) => console.log(error));
```

#### Get system hostname

```javascript
network
  .getHostName()
  .then((hostName) => console.log(hostName))
  .catch((error) => console.log(error));
```

#### Set system hostname

```javascript
network
  .setHostName(hostName)
  .then((hostName) => console.log(result))
  .catch((error) => console.log(error));
```

#### Get ethernet and wifi ip details (v1.0.5)

```javascript
network
  .getConnectionProfilesList(false)
  .then((data) => {
    const ethernet = data.find((item) => item.TYPE === "ethernet");
    const wifi = data.find((item) => item.TYPE === "wifi");
    network
      .getDeviceInfoIPDetail(ethernet.DEVICE)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    network
      .getDeviceInfoIPDetail(wifi.DEVICE)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  })
  .catch((error) => console.log(error));
```

#### Get all device ip details

```javascript
network
  .getAllDeviceInfoIPDetail()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Delete a connection (v1.0.11) _(new)_

```javascript
network
  .connectionDelete("b23522e9-c50e-43c2-bdca-ec0a5735b2ec")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

#### Add gsm connection (v1.0.11) _(new)_

```javascript
network
  .addGsmConnection(
    "gsm_test_delete_me",
    "*",
    "apn",
    "username",
    "password",
    "1234"
  )
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
```

## License

This project is licensed under the MIT License

## Change log

### 1.0.12 (2024-01-19)

- Fixed issue #4

### 1.0.11 (2024-01-19)

- Added support for hidden WiFi
- Added Connection Delete function (connectionDelete)
- Added addGsmConnection function

### 1.0.10 (2022-11-20)

- Add getAllDeviceInfoIPDetail function

### 1.0.9 (2022-02-22)

- Code refactoring, and additional functions: setHostName, deviceStatus, deviceConnect, deviceDisconnect, wifiHotspot, wifiCredentials

### 1.0.7 1.0.8 (2022-01-15)

- Fix getDeviceInfoIPDetail function

### 1.0.6 (2021-10-13)

- Fix SSID with spaces

### 1.0.5 (2021-10-03)

- added getDeviceInfoIPDetail function

### 1.0.4 (2021-10-03)

- added inUseBoolean field in 'getWifiList' result

### 1.0.3 (2021-09-26)

- Fixed Examples in README file

### 1.0.2 (2021-09-26)

- Fixed README file

### 1.0.1 (2021-09-26)

- Fixed README file

### 1.0.0 (2021-09-26)

- Release first version
