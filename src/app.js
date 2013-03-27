//imports
	var argv = require('optimist').argv;
	var express = require('express');
	var ejs = require('ejs');
	var _ = underscore = require('underscore');


//options
	var options = _.extend({
		port: process.env.PORT||argv.p||argv.port||8000
	}, argv);


//app server
	this.app = app = express();
	app.configure(function() {
		app.set('views', __dirname+"/../views/"); //folder of the compiled views
		app.use(express.static(__dirname + "/../static/")); //static folder, call it as the root
		app.set('view engine', 'ejs');
		app.set("view options", {layout: false});
		app.engine('html', require('ejs').renderFile);
		app.use(express.bodyParser());
		app.use(express.cookieParser('this is a very long hash. Please forget it! ok? :E'));
		app.use(express.session({
			key: 'myapp',
			secret: 'this is a very long hash. Please forget it! ok? :E'
		}));
	});
	app.engine('html', require('ejs').renderFile);


//constants
	var K1 = 'v1';


//utility
	var BaseAuthenticationControl = express.basicAuth(function(user, pass, callback) {
		var login = (user && pass);
		callback(null /* error */, login);
	});

	var login = function(req, res, callback) {
		req.session.user = 'user';
		callback();
	};

	var logout = function(req, res, callback) {
		if (req.session.user) { delete req.session.user; }
		callback();
	};

	var viewDefaultLocals = function(req) {
		return {
			_: underscore,
			session: req.session,
			queryString: req.query
		};
	};


//using
	app.use(function(req, res, next){
		//on each request coming to our server...
		next();
	});


//routing
	app.get('/', function(req, res) {
		res.render('index', viewDefaultLocals(req));
	});

	app.get('/login', BaseAuthenticationControl, login, function (req, res) {
		res.redirect('/');
	});

	app.all('/logout', logout, function (req, res) {
		res.redirect('/');
	});


//start
	app.listen(options.port);
	console.log("app started: http://localhost:"+options.port+"/");