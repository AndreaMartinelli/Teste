
var userController = require('./controller/userController.js');
var validator = require('validator');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoAdapter = require('socket.io-adapter-mongo');
io.adapter(mongoAdapter('mongodb://localhost:27017/socket-io'));



//teste Cluster
//var redis = require('socket.io-redis');
//io.adapter(redis({ host: 'localhost', port: 6379 }));

io.on('connection', function(socket){

	//Aqui o servidor coleta via query string a sala desejada
	var channelId = socket.handshake['query']['channel'];
	
	if(channelId !== undefined) {
		//Socket se "junta" a sala
		socket.join(channelId);

		var numQtd = io.sockets.adapter.rooms[channelId].length;
		console.log("Sala: " + channelId + " Qtd: " + numQtd);
		
		userController.listaAgencia(channelId,function(ret){
			sendUpdate(channelId,ret);
		});

		socket.on('disconnect', function(){
			console.log("Desconectou...");
		});
	}
});

app.get('/servidor', function(req, res) {
	res.end('Servidor ON!');
});

app.get('/', function(req, res) {

	res.header('Access-Control-Allow-Origin', '*');

	var tp_cd_uor = req.query.tp_cd_uor;

	if(tp_cd_uor !=undefined){

		validator.trim(validator.escape(tp_cd_uor));

		userController.listaAgencia(tp_cd_uor,function(resp) {
			res.json(resp);
		});
	}
});

app.get('/todos', function(req, res) {
	userController.listaTodos(function(resp) {
		res.json(resp);
	});
});

app.post('/', function(req, res) {

	var tp_cd_uor = req.query.tp_cd_uor;
	var codSegmento = req.query.segmento;
	var total = req.query.total;

	if(tp_cd_uor !=undefined && codSegmento !=undefined && total !=undefined){ 

		validator.trim(validator.escape(tp_cd_uor));
		validator.trim(validator.escape(codSegmento));
		validator.trim(validator.escape(total));

		userController.save(tp_cd_uor, codSegmento, total, function(resp) {
			res.json(resp);

			userController.listaAgencia(tp_cd_uor,function(ret){
				sendUpdate(tp_cd_uor,ret);
			});
		});		

	}else{
		res.json("Esta faltando parameto");
	}
});

app.put('/', function(req, res) {

	var tp_cd_uor = req.query.tp_cd_uor;
	var codSemento = req.query.segmento;
	var total = req.query.total;

	if(tp_cd_uor !=undefined && codSemento !=undefined && total !=undefined){ 

		validator.trim(validator.escape(tp_cd_uor));
		validator.trim(validator.escape(codSemento));
		validator.trim(validator.escape(total));

		userController.update(tp_cd_uor, codSemento, total, function(resp) {
			res.json(resp);

			userController.listaAgencia(tp_cd_uor,function(ret){
				sendUpdate(tp_cd_uor,ret);
			});
		});
		
	}else{
		res.json("Esta faltando parameto");
	}
	
});

app.delete('/', function(req, res) {

	var tp_cd_uor = req.query.tp_cd_uor;
	var codSemento = req.query.segmento;	

	if(tp_cd_uor !=undefined && codSemento !=undefined){ 

		validator.trim(validator.escape(tp_cd_uor));
		validator.trim(validator.escape(codSemento));
		
		userController.delete(tp_cd_uor,codSemento, function(resp) {
			res.json(resp);

			userController.listaAgencia(tp_cd_uor,function(ret){
				sendUpdate(tp_cd_uor,ret);
			});
		});
		
	}else{
		res.json("Esta faltando parameto");
	}
	
});

app.delete('/users/', function(req, res) {
	console.log("DELETE TODOS");
	userController.deleteTodos(function(resp) {
		res.json(resp);
	});
});

http.listen(3000);
console.log(http.address.address );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//Dispara evento para os ouvidores da sala
function sendUpdate(channelId, data) {
	io.to(channelId).emit('receivedUpdate', data);
}
