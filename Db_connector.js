var mysql = require("mysql");
const cron = require("node-cron");

class DbConnect {
  constructor() {
    this.mysqCredentials = {
      host: "localhost",
      user: "root",
      password: "1234",
    };
    this.mysqCredentialsDB = {
      host: "localhost",
      user: "root",
      password: "1234",
      database: "TicketManager",
    };
    this.connection = mysql.createConnection(this.mysqCredentials);
    this.connection.connect(function (err) {
      if (err) throw err;
      console.log("Database Connected!");
    });
    this.creatDatabase();
    this.createTableTickets();
    this.useDatabase();

  }

  creatDatabase() {
    var connection = this.connection;
    connection.query("CREATE DATABASE TicketManager", function (err, result) {
      if (err) console.log("Database already exists..");
      else console.log("Database created TicketManager");
    });
  }

  createTableTickets() {
    var connection = this.connection;
    var sql =
      "CREATE TABLE Tickets(TicketId INT AUTO_INCREMENT PRIMARY KEY,Name VARCHAR(500),Contact VARCHAR(256),Timming TIMESTAMP DEFAULT CURRENT_TIMESTAMP);";
    connection.query(sql, function (err, result) {
      if (err) console.log("Table Tickets already exists ..");
      else console.log("Table Created Tickets");
    });
  }

  useDatabase() {
    this.connection.end();
    this.connection = mysql.createConnection(this.mysqCredentialsDB);
    this.connection.connect(function (err) {
      if (err) throw err;
      console.log("Database With TicketManager Connected!");
    });
  }


  CheckCountOfItems(timming, insertIfOk) {
    var connection = this.connection;
    var sql = "SELECT COUNT(*) FROM Tickets where Timming= '" + timming + "'";
    console.log(sql);
    connection.query(sql, (err, result) => {
      if (err) {
        insertIfOk(false);
        throw err;
      } else {
        var res = result[0]["COUNT(*)"];
        if (res >= 20) insertIfOk(false);
        else insertIfOk(true);
      }
    });
  }

  InsertNewTicket(name, contact, timming, cb) {
    var connection = this.connection;

    function insertIfOk(ok) {
      if (!ok) {
        cb("20 Values Exists!", -1);
      } else {
        var values = [name, contact, timming];
        console.log(values);

        var sql =
          "INSERT INTO Tickets (Name, Contact, Timming) VALUES ('" +
          name +
          "','" +
          contact +
          "','" +
          timming +
          "')";

        connection.query(sql, function (err, result) {
          var idx = "";
          var error = "";
          if (err) err = error;
          else idx = result.insertId;
          cb(err, result.insertId);
        });
      }
    }
    this.CheckCountOfItems(timming, insertIfOk);
  }

  checkIfTicketIdExist(TicketId, cb) {
    var connection = this.connection;
    var sql_check = "SELECT * FROM Tickets WHERE TicketId='" + TicketId + "'";
    connection.query(sql_check, (err, result) => {
      if (err) cb(err);
      else if (result.length == 0) {
        cb("No such TicketId Found!!");
        return;
      } else {
        cb("");
      }
    });
  }


  }
}

module.exports = DbConnect;
