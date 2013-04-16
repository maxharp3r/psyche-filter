// external dependencies
var express = require('express');
var http = require('http');
var path = require('path');

// local dependencies
var config = require('./config.json');
var routes = require('./src/routes');

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
});

app.post('/surveys/new', routes.process_survey);

app.get('/:name', routes.render_html);


// Angular app
//app.get('/', routes.angular_app);
//app.get('/domains/*', routes.angular_app);


http.createServer(app).listen(config.bind.port, config.bind.host, function () {
    console.log("Express server listening on http://" + config.bind.host + ":" + config.bind.port + "/");
});
