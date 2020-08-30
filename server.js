const express = require("express");
const app = express();
const DbConnect = require("./Db_connector.js");
var DbConnect_obj = new DbConnect();
var port = process.env.port || 3000;
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/i", (req, res) => {
  function cb(err, index) {
    res.send({ Index: index, error: err });
  }
  DbConnect_obj.InsertNewTicket("Kapil", 8209714523, "2020-12-11 13:00:00", cb);
});

app.get("/u", (req, res) => {
  function cb(err) {
    res.send({ error: err });
  }
  DbConnect_obj.UpdateTicketTime(3, "2020-12-11 13:00:00", cb);
});

app.listen(port, (req, res) => {
  console.log("Server running on port ", port);
});
