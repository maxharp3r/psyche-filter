// external dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var redis = require("redis");

// local dependencies
var config = require('./config.json');
var routes = require('./src/routes');
var scorer = require('./src/scorer');

var app = express();
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false, debug: true, pretty: true });
    app.set('strict routing', true);
    app.use(express['static'](path.join(__dirname, 'public')));
    app.use(express.favicon());
    app.use(express.logger('dev'));

    app.use(express.bodyParser());
    app.use(express.cookieParser('aofineknasldifahd'));
    app.use(express.session({ key: 'sid', cookie: { maxAge: config.cookie_max_age }}));
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function() {
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

var redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


var server = http.createServer(app).listen(config.bind.port, config.bind.host, function () {
    console.log("Express server listening on http://" + config.bind.host + ":" + config.bind.port + "/");
});

var io = require('socket.io').listen(server, {
  // see https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
  'log level': 1
});
io.sockets.on('connection', function (socket) {

    socket.on('CMD:words', function (words) {
        console.log("on CMD:words", words);
        io.sockets.emit('CMD:words', words);
    });

    socket.on('CMD:control', function (cmd) {
        console.log("on CMD:control", cmd);
        io.sockets.emit('CMD:control', cmd);
    });

});


app.post('/surveys/new', function(req, res) {
    var survey_data = req.body;
    console.log("survey_data:", survey_data);
    if (!survey_data) {
        res.json({"failure": "empty body"});
        return;
    }

    var name = survey_data["name"] || "_";
    var words = scorer.survey_to_word_list(survey_data);

    // put the thing to redis
    redisClient.hset("cube:surveys", name.toLowerCase(), words, function (err, reply) {
        if (err) {
            console.log("Error " + err);
            res.json({'success': false});
            return;
        }
        console.log("Set survey data for " + name);
        res.json({'success': true});
    });
});

app.post('/cube/start', function(req, res) {
    console.log("someone is entering the cube: ", req.body);
    var name = req.body.name;
    if (!name) {
        res.json({"failure": "empty body"});
        return;
    }

    // put the thing to redis
    redisClient.hget("cube:surveys", name.toLowerCase(), function (err, reply) {
        if (err || !reply) {
            console.log("Error " + err);
            res.json({'success': false});
            return;
        }
        console.log("Found survey data for " + name);
        console.log("Words:", reply);

        io.sockets.emit('EVENT:start');

        res.json({'success': true});
    });
});
app.get('/:name', routes.render_jade);

