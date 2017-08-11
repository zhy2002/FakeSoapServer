var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var xmlparser = require('express-xml-bodyparser');

var app = express();
app.use(xmlparser());

var portNumber = 3333;
var defaultFilePath = path.join(__dirname, 'default.xml');

app.post("/*", function(req, res) {
    var filePath = path.join(__dirname, req.url);
	console.log('========== Request Received ===========');
	console.log('Responding ' + req.method + ' with ' + filePath);
	console.log(req.body); //only parsed when post content type is xml.
	
	try {
		fs.accessSync(filePath, fs.F_OK);
	} catch (e) {
		// It isn't accessible
		filePath = defaultFilePath;
		console.log('file not found, serving default.');
	}

	var responseFile = fs.statSync(filePath);
	var headers = createHeaders(filePath, responseFile.size);
    res.writeHead(200, headers);

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res); // We replaced all the event handlers with a simple call to readStream.pipe()
});

function createHeaders(filePath, size) {
	var headers = {
        'Content-Type': 'application/soap+xml',
        'Content-Length': size
    };
	return headers;
}
	
var server = http.createServer(app);
server.listen(portNumber);
console.log("FakeSoapServer started at: http://localhost:" + portNumber);

