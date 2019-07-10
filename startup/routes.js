const express = require("express");
const title = require("../routes/title");
const cbtitle = require("../routes/cbtitle");

module.exports = function(app) {
  app.use("/title/", title);
  app.use("/cb/title/", cbtitle);
  app.get("*", (req, res) => {
    res.status(404).send("Error 404 : PAGE NOT FOUND");
  });
};
