var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var formidable = require("formidable");

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

//支持POST的中间件
app.use(bodyParser());
//中间件对象
// app.use(function(req,res,next){
// 	if(! res.locals.partials) res.locals.partials = {};
// 	// res.locals.partials.weather = getWeatherData();
// 	res.locals.partials.twitter = '';
// 	next();
// });

var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple.",
];

app.get('/', function(req, res) {
	res.render('home');
});

//显示头信息
app.get('/headers',function(req,res){
	res.set('Content-Type','text/plain');
	var s="";
	for(var name in req.headers){
		s += name +": "+req.headers[name]+'\n';
	}
	res.send(s);
})

app.get('/about', function(req,res){
	var randomFortune = 
		fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
	res.render('about', { fortune: randomFortune });
});

app.get('/thank-you',function(req,res){
	res.render('thank-you');
})

//接受POST提交
app.post('/post',function(req,res){
	console.log('Received contact from ' + req.body.name + ' <'+req.body.email+'>');
	//保存到数据库...
	//res.send('thinks');
	//返回json
	var jsonstr = [
		{'a':1,'b':2},
		{'c':3,'d':4}
	];
	res.json(jsonstr);
});

//文件上传处理

app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year : now.getFullYear(),month : now.getMonth()
	});
})

app.post('/contest/vacation-photo/:year/:month',function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err) return res.redirect(303,'/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303,'/thank-you');
	});
})

//返回xml json text
app.get('/api/tours',function(req,res){
	var toursXml = '<?xml version="1.0"? ><tours>' +
		products.map(function(p){
			return '<tour price="'+p.price +
				'" id="' + p.id + '">' + p.name + '</tour>';
		}).join('') + '</tours>';
		
		var toursText = tours.map(function(){
			return p.id + ': ' + p.name + ' (' + p.price + ')';
		}).join('\n');
		
		res.format({
				'application/json' : function(){
					res.json(tours);
				},
				'application/xml' : function(){
					res.type('application/xml');
					res.send(toursXml);
				},
				'text/xml' : function() {
					res.type('text/xml');
					res.send(toursXml);
				},
				'text/plain' : funciton(){
					res.type('text/plain');
					res.send(toursXml);
				}
			});
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});



app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.' );
});
