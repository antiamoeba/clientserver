var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io');
io = io.listen(http);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var resArr = {};
app.get('/:id', function(req, res) {handleRequest(req, res);});
app.post('/:id', function(req, res) {handleRequest(req, res);});
app.get('/:id/*', function(req, res) {handleRequest(req, res);});
app.post('/:id/*', function(req, res) {handleRequest(req, res);});
function handleRequest(req, res) {
	var id = req.params.id;
	var socket = io.sockets.sockets[id];
	var request = {"get":req.query, "post":req.body, "url": req.url};
	socket.emit("request",request);
	resArr[id] = res;
}
var port = process.env.PORT || 2000;
http.listen(port, function(){
	console.log('listening on *:'+port);
});
io.sockets.on('connection', function(socket){
	console.log('a user connected');
	socket.emit("id", socket.id);
	socket.on('response', function(response){
		resArr[socket.id].send(response);
	});
});