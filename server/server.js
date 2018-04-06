const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/", express.static(__dirname + '/../dist'));

app.get('/', function(req, res){
	res.redirect("/index.html");
});

app.use("/api", require('./cloudant'));

app.use((err, req, res, next) => {
	console.log(err);
	if (res.finished) return;
	if (res.headersSent)
	{
		if (typeof err === 'string')
		{
			err = { message: err };
		}
		if (err.status == null)
		{
			err.status = 500;
		}
		res.write(JSON.stringify(err));
		res.end();
	}
	else
	{
		res.status(500).send(err);
	}
});


let port = process.env.PORT || 9999;
http.createServer(app).listen(port, () =>
{
	console.log(`Server started on http://localhost:${port}`);
});
