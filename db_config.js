//teste
//var db_string= 'mongodb://localhost:27017/Portal';
//var db_string= process.env.DATABASE_URL
var db_string= 'mongodb://localhost:27017/Portal';
//var db_string= process.env.DATABASE_URL;
var mongoose = require('mongoose').connect(db_string);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro ao conectar no banco'));
db.once('open', function() {

	var userSchema = mongoose.Schema({
		tp_cd_uor: String,
		codSegmento: String,
		segmento: String,
		total: Number,
		created_at: Date
	});

	exports.User = mongoose.model('User', userSchema);
});
