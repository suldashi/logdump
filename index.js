'use strict';

const express = require("express");
const cors = require('cors')
const app = express();
const server = require("http").createServer(app);
const path = require("path");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite');
app.use(express.json());

const port = 8889;

let head = `<!doctype html>
<html>
<head>
    <title>logdump</title>
</head>
<body><ul>`;
let foot = `</ul<</body>
</html>`;

app.use('/public', express.static(path.resolve(__dirname,"..",'public')));

app.get("/",(req,res) => {
	console.log("home");
    db.all("SELECT rowid AS id, log_tag, timestamp, log_content FROM logs ORDER BY timestamp DESC", function(err, rows) {
        let tags = rows.map(x => `<li><a href='/${x.id}'>${x.log_tag}: ${x.timestamp}</a></li>`).reduce((prev, curr) => prev + curr, "");
        res.send(head + tags + foot);
    });
});

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

app.get("/:id",(req,res) => {
    let rowId = req.params.id;
	if(!isInt(rowId)) {
	    res.status(404);
	    res.send();
	    return;
	}
    db.get("SELECT log_content FROM logs WHERE rowid = ?", [rowId] , function(err, row) {
        let data = JSON.parse(row.log_content);
        data.info = data.info.map(JSON.parse);
        data.log = data.log.map(JSON.parse);
        data.warn = data.warn.map(JSON.parse);
        data.error = data.error.map(JSON.parse);
        res.send(data);
    });
});

app.options("/submit", cors());

app.post("/submit", cors(), (req,res) => {
    var stmt = db.prepare("INSERT INTO logs VALUES (?,?,?)");
    stmt.run(req.body.log_tag, new Date().toISOString(), req.body.log_content);
    res.send();
});

app.set("x-powered-by",false);

server.listen(port);
console.log("started on " + port);
