var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');

// app.param('user', function(req, res, next, id) {

//   User.find(id, function(err, user) {
//     if (err) {
//       next(err);
//     } else if (user) {
//       req.user = user;
//       next();
//     } else {
//       next(new Error('failed to load user'));
//     }
//   });
// });


var allowCors = function(req, res, next) {

//	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

	next();
}

app.listen(3000);

//app.use(allowCors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
