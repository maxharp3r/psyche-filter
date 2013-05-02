// core dependencies
var http = require("http");
var sys = require("sys");

// installed dependencies
// https://github.com/substack/node-ent
var ent = require('ent');
// https://github.com/tautologistics/node-htmlparser
var htmlparser = require("htmlparser");



var fetchUrl = function(url, callback) {
    var output = "";

    http.get(url, function(res) {
        if (res.statusCode !== 200) {
            console.log("failed to reach the URL", res);
            return;
        }

        res.on("data", function(chunk) {
            console.log("downloaded chunk...");
            output += chunk;
        });

        res.on("end", function(chunk) {
            callback(output);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

// parser for the "description" field - get matcher group 2 for data
var BODY_REGEX = /\!\[CDATA\[Coupon Expiration:.*?(2013|Date).(.*)\]\]/;

var parseRss = function(xml) {
    var rssHandler = new htmlparser.RssHandler(function (error, dom) {
        if (error) {
            console.log("error handling rss: ", error);
            return;
        } else {
            console.log("parsing done.");
            console.log(dom);

            dom.items.forEach(function (item, index) {
                console.log("title: ", ent.decode(item.title));
                console.log("link: ", ent.decode(item.link));
                console.log("date: ", item.pubDate);

//                var description = ent.decode(item.description);
//                var result = description.match(BODY_REGEX);
//                var cleanDescription = result[2];
//                console.log("description: ", cleanDescription);

                console.log("--");
            });

            console.log("---");
        }
    }, { verbose: false, ignoreWhitespace: true });

    var parser = new htmlparser.Parser(rssHandler);
    parser.parseComplete(xml);
}

fetchUrl("http://www.anycodes.com/rss-newest-online-coupons-deals.xml", parseRss);
