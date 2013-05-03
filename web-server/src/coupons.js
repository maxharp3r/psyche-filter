var ent = require('ent'); // https://github.com/substack/node-ent
var htmlparser = require("htmlparser"); // https://github.com/tautologistics/node-htmlparser
var http = require("http");
var redis = require("redis");
var sys = require("sys");


var redisClient = redis.createClient();
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


var fetchUrl = function(url, category, callback) {
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
            callback(output, category);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

// parser for the "description" field - get matcher group 2 for data
var BODY_REGEX = /\!\[CDATA\[Coupon Expiration:.*?Date.(.*)\]\]/;
var CDATA_REGEX = /\!\[CDATA\[(.*)\]\]/;
var LINEBR_REGEX = /(\r\n|\n|\r)/gm;

var clean_cdata_field = function(str) {
    var decoded = ent.decode(str.replace(LINEBR_REGEX, ""));
    var result = decoded.match(CDATA_REGEX);
    if (result && result[1]) {
        return result[1].trim();
    } else {
        return result;
    }
}

var parseRss = function(xml, category) {
    var rssHandler = new htmlparser.RssHandler(function (error, dom) {
        if (error) {
            console.log("error handling rss: ", error);
            return;
        } else {
            console.log("parsing done.");
            // console.log(dom);

            console.log("=========================");
            console.log("category: ", category);
            dom.items.forEach(function (item, index) {
                var coupon = {
                    "title": clean_cdata_field(item.title),
                    "description": clean_cdata_field(item.description),
                    "link": ent.decode(item.link)
                }
                console.log("coupon (post-process): ", coupon);

                // put the coupon to the db
                redisClient.sadd("cube:coupons:cats:" + category, JSON.stringify(coupon), function(err, reply) {
                    if (err) {
                        console.log("Error in getting coupon " + err);
                    }
                    console.log("reply: " + reply);
                });
            });

            console.log("---");
        }
    }, { verbose: false, ignoreWhitespace: true });

    var parser = new htmlparser.Parser(rssHandler);
    parser.parseComplete(xml);
}

//fetchUrl("http://www.anycodes.com/rss-newest-online-coupons-deals.xml", "default", parseRss);

fetchUrl("http://www.couponchief.com/rss/tags/sale", "volatility", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/furniture", "x_volatility", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/software", "withdrawal", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/fashion", "x_withdrawal", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/shoes", "enthusiasm", parseRss);
fetchUrl("http://www.couponchief.com/rss/officedepot", "x_enthusiasm", parseRss);
fetchUrl("http://www.couponchief.com/rss/victoriassecret", "assertiveness", parseRss);
fetchUrl("http://www.couponchief.com/rss/staples", "x_assertiveness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/baby", "compassion", parseRss);
fetchUrl("http://www.couponchief.com/rss/shop.mlb", "x_compassion", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/gifts", "politeness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/car", "x_politeness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/books", "intellect", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/free", "x_intellect", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/travel", "openness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/security", "x_openness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/business", "industriousness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/games", "x_industriousness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/home", "orderliness", parseRss);
fetchUrl("http://www.couponchief.com/rss/tags/art", "x_orderliness", parseRss);



////Construction Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Construction-coupons-deals-109.xml", "volatility", parseRss);
//
////Photography Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Photography-coupons-deals-4.xml", "x_volatility", parseRss);
//
////Computers Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Computers-coupons-deals-1.xml", "withdrawal", parseRss);
//
////Clothing & Accessories Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Clothing-Accessories-coupons-deals-2.xml", "x_withdrawal", parseRss);
//
////Flowers & Gourmet Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Flowers-Gourmet-coupons-deals-17.xml", "enthusiasm", parseRss);
//
////Office Products Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Office-Products-coupons-deals-7.xml", "x_enthusiasm", parseRss);
//
////Careers Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Careers-coupons-deals-37.xml", "assertiveness", parseRss);
//
////Miscellaneous Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Miscellaneous-coupons-deals-111.xml", "x_assertiveness", parseRss);
//
////Parenting & Families Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Parenting-Families-coupons-deals-11.xml", "compassion", parseRss);
//
////Electronics Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Electronics-coupons-deals-3.xml", "x_compassion", parseRss);
//
////Telecommunications Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Telecommunications-coupons-deals-35.xml", "politeness", parseRss);
//
////Games & Toys Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Games-Toys-coupons-deals-61.xml", "x_politeness", parseRss);
//
////Books & Magazines Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Books-Magazines-coupons-deals-12.xml", "intellect", parseRss);
//
////Automotives Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Automotives-coupons-deals-10.xml", "x_intellect", parseRss);
//
////Art & Collectibles Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Art-Collectibles-coupons-deals-32.xml", "openness", parseRss);
//
////Internet Services Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Internet-Services-coupons-deals-9.xml", "x_openness", parseRss);
//
////Finance & Insurance Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Finance-Insurance-coupons-deals-33.xml", "industriousness", parseRss);
//
////Entertainment Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Entertainment-coupons-deals-26.xml", "x_industriousness", parseRss);
//
////Home & Garden Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Home-Garden-coupons-deals-19.xml", "orderliness", parseRss);
//
////Pet Supplies Coupon
//fetchUrl("http://www.anycodes.com/rss-category-Pet-Supplies-coupons-deals-29.xml", "x_orderliness", parseRss);


//    "volatility"
//    "x_volatility"
//    "withdrawal"
//    "x_withdrawal"
//    "enthusiasm"
//    "x_enthusiasm"
//    "assertiveness"
//    "x_assertiveness"
//    "compassion"
//    "x_compassion"
//    "politeness"
//    "x_politeness"
//    "intellect"
//    "x_intellect"
//    "openness"
//    "x_openness"
//    "industriousness"
//    "x_industriousness"
//    "orderliness"
//    "x_orderliness"
