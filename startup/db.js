const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  mongoose
    .connect(config.get("DB"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log(`connected to ${config.get("DB")} `))
    .catch((e) => console.log("unable to connect to database", e));
};
