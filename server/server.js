const http = require('http');
const express = require('express');
const app = express();

app.use("/", express.static(__dirname + '/../www'));

app.get('/', function(req, res){
	res.redirect("/index.html");
});

let port = process.env.PORT || 9999;
http.createServer(app).listen(port, () =>
{
	console.log(`Server started on http://localhost:${port}`);
});
