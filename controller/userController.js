var db = require('../db_config.js');
var HashMap = require('hashmap');

var map = new HashMap();

map.set("001","VG");
map.set("002","VG");
map.set("003","VG");
map.set("096","VG");
map.set("304","VG");

map.set("004","ESP");
map.set("005","ESP");
map.set("006","ESP");
map.set("007","ESP");
map.set("106","ESP");
map.set("296","ESP");

map.set("011","E1");
map.set("015","E1");
map.set("226","E1");
map.set("227","E1");
map.set("017","E1");
map.set("111","E1");
map.set("211","E1");
map.set("212","E1");
map.set("213","E1");
map.set("214","E1");

map.set("012","E2");

map.set("228","E3");
map.set("229","E3");

map.set("009","Sel");

exports.list = function(callback){

	db.User.find({},{_id:0,tp_cd_uor:1,codSegmento:1,segmento:1,total:1}, function(error, user) {
		if(error) {  
			callback({error: 'Não foi possivel retornar clientes'});
		} else {
			callback(user);
		}
	});
};

exports.listaTodos = function(callback) {

	db.User.find({}, function(error, user) {
		if(error) {  
			callback({error: 'Não foi possivel retornar o clientes'});
		} else {
			callback(user);
		}
	});
};   

exports.listaAgenciaSegmento = function(tp_cd_uor,segmento, callback) {

	db.User.find({'tp_cd_uor':tp_cd_uor,'segmento':segmento}, function(error, user) {
		if(error) {  
			callback({error: 'Não foi possivel retornar o clientes'});
		} else {
			callback(user);
		}
	});
};          

exports.listaAgencia = function(tp_cd_uor, callback) {

	db.User.aggregate([	
        { $match: {'tp_cd_uor':tp_cd_uor}},          
        { $group: { _id:'$segmento', total: { $sum: '$total'}}}
    ], function(error, user) {
		if(error) {  
			callback({error: 'Não foi possivel retornar o clientes'});
		} else {
			callback(user);
		}
	});
};         

exports.save = function(tp_cd_uor, codSegmento, total, callback){
	console.log(codSegmento);
	db.User.findOne({'tp_cd_uor':tp_cd_uor,'codSegmento':codSegmento}, function(error, user) {				
		console.log(user);
		if(user === null || user == undefined){
		
			var segm = map.get(codSegmento);
			if(segm === null || segm == undefined) {
				segm = "000";
			}
			
			user = new db.User({		
				'tp_cd_uor': tp_cd_uor,
				'codSegmento': codSegmento,
				'segmento': segm,
				'total': total,
				'created_at': new Date()
			});
		}else{
			user.total = total;
		}
		user.save(function(error, user) {
			if(error) {
				callback({error: 'Não foi possivel salvar o clientes'});
			} else {
				callback(user);
			}
		});
	});
};


exports.update = function(tp_cd_uor, codSegmento, total, callback) {
	db.User.findOne({'tp_cd_uor':tp_cd_uor,'codSegmento':codSegmento}, function(error, user) {		
		
		if(user !== null){
			user.total = total;
			
			user.save(function(error, user) {

				if(error) {
					callback({error: 'Não foi possivel salvar o clientes'});
				} else {
					callback(user);
				}
			});
		}else{
			callback({error: 'Não foi possivel salvar o clientes'});
		}
	});
};


exports.delete = function(tp_cd_uor, codSegmento, callback) {

	db.User.findOne({'tp_cd_uor':tp_cd_uor,'codSegmento':codSegmento}, function(error, user) {
		
		if(error) {
			callback({error: 'Não foi possivel retornar o clientes'});
		} else {
			user.remove(function(err,user) {
				if(!err) {
					callback({response: 'Cliente excluido com sucesso'});
				}
			});
		}
	});
};

exports.deleteTodos = function(callback) {

	db.User.find({}, function(error, user) {
		if(error) {
			callback({error: 'Não foi possivel retornar o clientes'});
		} else {
			db.User.remove(function(err,user) {
				if(!err) {
					callback({response: 'Cliente excluido com sucesso'});
				}
			});
		}
	});
};