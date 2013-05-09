// external dependencies
var exec = require('child_process').exec;
var express = require('express');
var http = require('http');
var path = require('path');
var querystring = require('querystring');
var redis = require("redis");
var sys = require('sys')

// local dependencies
var config = require('./config.json');
var routes = require('./src/routes');
var scorer = require('./src/scorer');

// for running command-line
function outstream(error, stdout, stderr) { sys.puts(stdout) }

if (!config.printer) {
    throw "need to configure printer settings in config.json";
}

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
    var coupon_str = coupon['title'] + "\n" + coupon['description'] + "\nvisit " + coupon['link'];

    var post_data = querystring.stringify({
        'inverse': 'Profile Cube',
        'large': name,
        'word': words.slice(0, -1),
        'lastword': words.slice(-1),
        'linefeed': '',
        'msg2': 'Profile Cube ValueFeed(tm):',
        'coupon': coupon_str
    });
    console.log("coupon:");
    console.log(post_data);

    var post_options = {
        host: config.printer.host,
        path: config.printer.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // write parameters to post body
    post_req.write(post_data);
    post_req.end();
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
    exec("say enter the profile cube and please shut the door behind you", outstream);

    // print (need delay to give redis a chance to find something)
    setTimeout(function() {
        console.log("printing...");
        if (coupon) {
            console.log("found a coupon");
            printer_routine(name, words, coupon);
        }
    }, 1000);

    // show words
    setTimeout(function() {
        console.log("emitting words:", JSON.stringify(words));
        io.sockets.emit('CMD:words', words);
        exec("afplay data/38.mp3", outstream);
    }, 10000);

    // all on
    setTimeout(function() {
        console.log("all on");
        io.sockets.emit('CMD:control', 'all_on');
    }, 56000);

    // exit
    setTimeout(function() {
        console.log("exit on");
        io.sockets.emit('CMD:control', 'exit_on');
        exec("afplay data/ding.wav; say please exit the profile cube and pick up your receipt to the right", outstream);
    }, 61000);

    // entry available
    setTimeout(function() {
        io.sockets.emit('EVENT:end');
    }, 66000);
}
