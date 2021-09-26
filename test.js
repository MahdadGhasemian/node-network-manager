const networkManager = require("./bin/networkManager");

const network = new networkManager();

// network
//   .getIPv4()
//   .then((ipData) => console.log(ipData))
//   .catch((error) => console.log(error));

// network
//   .getHostName()
//   .then((hostName) => console.log(hostName))
//   .catch((error) => console.log(error));

// network
//   .enable()
//   .then(() => console.log("network has just turned on"))
//   .catch((error) => console.log(error));

// network
//   .disable()
//   .then(() => console.log("network has just turned off"))
//   .catch((error) => console.log(error));

// network
//   .getNetworkConnectivityState()
//   .then((hostName) => console.log(hostName))
//   .catch((error) => console.log(error));

// network
//   .wifiEnable()
//   .then(() => console.log("wifi was enabled"))
//   .catch((error) => console.log(error));

// network
//   .wifiDisable()
//   .then(() => console.log("wifi was disabled"))
//   .catch((error) => console.log(error));

// network
//   .getWifiStatus()
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// const fs = require("fs");
// const path = require("path");
// const myFile = fs.createWriteStream(path.join(__dirname, "myOutput.txt"));
// network
//   .activityMonitor(process.stdout)
//   .then((endStream) => {
//     console.log("start monitor");
//     setTimeout(() => {
//       console.log("stop monitor");
//       endStream();
//     }, 5000);
//   })
//   .catch((error) => console.log(error));
// network
//   .activityMonitor(myFile)
//   .then((endStream) => {
//     console.log("start monitor");
//     setTimeout(() => {
//       console.log("stop monitor");
//       endStream();
//     }, 5000);
//   })
//   .catch((error) => console.log(error));

network
  .getConnectionProfilesList()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

// network
//   .connectionUp("79373ad4-c462-43f7-90bd-ffdd4036623f")
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// network
//   .connectionDown("79373ad4-c462-43f7-90bd-ffdd4036623f")
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// network
//   .connectionDown("d9c504c1-14ef-4cbf-873a-9888d32db5e1")
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

network
  .getWifiList(true)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

// network
//   .wifiConnect("Meshkat", "mahdad2021")
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// network
//   .wifiConnect("HUAWEI2021", "1234567890")
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
