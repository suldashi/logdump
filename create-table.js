var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite');

db.serialize(function() {
  db.run("CREATE TABLE logs (log_tag TEXT, timestamp TEXT, log_content TEXT)");
});

db.close();