// external dependencies
var exec = require('child_process').exec;
var express = require('express');
var http = require('http');
var path = require('path');
var redis = require("redis");
var sys = require('sys')


// local dependencies
var config = require('./config.json');
var routes = require('./src/routes');
var scorer = require('./src/scorer');

// for running command-line
function outstream(error, stdout, stderr) { sys.puts(stdout) }

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

    socket.on('CMD:name', function (name) {
        console.log("on CMD:name", name);
        redisClient.hget("cube:surveys", name.toLowerCase(), function (err, reply_str) {
            var scores = JSON.parse(reply_str);
            cube_routine(name, scores['words'], scores['top_category']);
        });
    });

    socket.on('CMD:control', function (cmd) {
        console.log("on CMD:control", cmd);
        io.sockets.emit('CMD:control', cmd);
    });

});


app.post('/surveys/new', function(req, res) {
    var survey_data = req.body;
    // console.log("survey_data:", survey_data);
    if (!survey_data) {
        res.json({"failure": "empty body"});
        return;
    }

    var name = survey_data["name"] || "_";
    var survey_scores = scorer.survey_to_word_list(survey_data);

    // put the words to redis
    redisClient.hset("cube:surveys", name.toLowerCase(), JSON.stringify(survey_scores), function(err, reply) {
        if (err) {
            console.log("Error " + err);
            return;
        }
        console.log("Set survey data for " + name);
        res.json({'success': true});
    });

    // find a coupon to put
    redisClient.srandmember("cube:coupons:cats:" + survey_scores['top_category'], function(err, reply) {
        if (err) {
            console.log("Error in getting coupon " + err);
            return;
        }
        if (!reply) {
            console.log("Could not find a coupon for category " + survey_scores['top_category'] + ", exiting");
            return;
        }
        console.log("found coupon for user " + name);
        redisClient.hset("cube:coupons:users", name.toLowerCase(), reply, function(err, reply) {
            if (err) {
                console.log("Error in setting coupon " + err);
                return;
            }
            console.log("stored coupon for user " + name);
        });
    });
    res.json({'success': true});
});


app.post('/cube/start', function(req, res) {
    console.log("someone is entering the cube: ", req.body);
    var name = req.body.name;
    if (!name) {
        res.json({"failure": "empty body"});
        return;
    }

    redisClient.hget("cube:surveys", name.toLowerCase(), function (err, reply_str) {
        if (err || !reply_str) {
            console.log("Error " + err);
            res.json({'success': false});
            return;
        }
        console.log("Found survey data for " + name);

        var reply = JSON.parse(reply_str);
        var words = reply['words'];
        var top_category = reply['top_category'];
        cube_routine(name.toLowerCase(), words, top_category);
        res.json({'success': true});
    });
});
app.get('/:name', routes.render_jade);

var printer_routine = function(name, words, coupon) {
    console.log("==============");
    console.log("COUPON for " + name);
    console.log("Your profile words are: " + words);
    console.log("Your personalized coupon is: " + coupon['title'] + "\n" + coupon['description'] + "\nvisit "
            + coupon['link']);
    console.log("==============");
}

var cube_routine = function(name, words, top_category) {
    // start fetching the coupon, it will be ready when we initate the printer
    var coupon = undefined;
    redisClient.hget("cube:coupons:users", name.toLowerCase(), function (err, reply_str) {
        if (err) {
            console.log("Error fetching user coupon for " + name + err);
            return;
        }
        console.log("Fetched coupon data for " + name);
        coupon = JSON.parse(reply_str);
    });

    // entry blocked, spotlight on
    io.sockets.emit('EVENT:begin');

    exec("afplay data/test_sound.mp3", outstream);

    // show words
    setTimeout(function() {
        console.log("emitting words:", JSON.stringify(words));
        io.sockets.emit('CMD:words', words);
    }, 1000);

    // print
    setTimeout(function() {
        console.log("printing...");
        printer_routine(name, words, coupon);
    }, 1000);

    // entry available
    setTimeout(function() {
        io.sockets.emit('EVENT:end');
    }, 15000);
}
