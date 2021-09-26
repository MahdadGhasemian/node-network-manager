const network = require("./index.js");

network
  .getConnectionProfilesList()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

network
  .getWifiList(true)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
