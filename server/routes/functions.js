var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('scrape-meta');
var express = require("express");
var bodyParser = require('body-parser');
var Nightmare = require('nightmare'),
    nightmare = Nightmare({
        show: false
    });
var phantom = require('phantom');
var jsdom = require('jsdom');



Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'jade');
app.use(express.static('public'));

var serviceAccount = require("../path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiosk-f1a66.firebaseio.com"
});

var db = admin.firestore();

var sources = ["CoinDesk", "Bitcoin News"]

function coindesk() {
    var n = new Set();
    request("https://www.coindesk.com/", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('a').each(function () {


            var articls = $(this).attr('class');
            if (articls === "fade") {

                let link = $(this).attr('href')

                if (!(n.has(link))) {
                    og
                        .scrapeUrl(link)
                        .then((metadata) => {
                            var lastIndex = metadata["title"].lastIndexOf("-");
                            var title = metadata["title"].substring(0, lastIndex);

                            var docRef = db.collection("articles").doc()
                            var articles = {
                                "id": docRef.id,
                                "site": metadata["publisher"],
                                "url": metadata["url"],
                                "title": title,
                                "image": metadata["image"],
                                "date-a": metadata["date"]
                            }
                            //console.log(articles)
                            docRef.set(articles)
                        }).catch((err) => console.error("Fail"))

                }
                n.add(link)
            }

        });
    });

}

function bitcoin() {

    request("https://news.bitcoin.com/", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="td_module_mx3 td_module_wrap td-animation-stack"]').find('div > a').each(function () {

            var a = $(this).attr('href');
            og
                .scrapeUrl(a)
                .then((metadata) => {
                    var lastIndex = metadata["title"].lastIndexOf("-");
                    var title = metadata["title"].substring(0, lastIndex);

                    var docRef = db.collection("articles").doc()
                    var articles = {
                        "id": docRef.id,
                        "site": metadata["publisher"],
                        "url": metadata["url"],
                        "title": title,
                        "image": metadata["image"],
                        "date-a": metadata["date"]
                    }
                    //console.log(articles)
                    docRef.set(articles)
                }).catch((err) => console.error("Fail"))
        });
    });

}


function blockonomi() {
    var links = ["https://blockonomi.com/page/2/", "https://blockonomi.com/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('a[class="grid-thumb-image"]').each(function () {

                var a = $(this).attr('href');
                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        //console.log(metadata["title"])


                        var docRef = db.collection("articles").doc()
                        var articles = {
                            "id": docRef.id,
                            "site": metadata["publisher"],
                            "url": metadata["url"],
                            "title": metadata["title"],
                            "image": metadata["image"],
                            "date-a": metadata["date"]
                        }
                        //console.log(articles)
                        docRef.set(articles)
                    }).catch((err) => console.error("Fail"))
            });
        });
    }
}

function cointele() {

    request("https://cointelegraph.com/", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('.header').filter(function () {
            console.log($(this))
            var a = $(this).attr('href');

            og
                .scrapeUrl(a)
                .then((metadata) => {
                    var lastIndex = metadata["title"].lastIndexOf("-");
                    var title = metadata["title"].substring(0, lastIndex);

                    var docRef = db.collection("articles").doc()
                    var articles = {
                        "id": docRef.id,
                        "site": metadata["publisher"],
                        "url": metadata["url"],
                        "title": title,
                        "image": metadata["image"],
                        "date-a": metadata["date"]
                    }
                    //console.log(articles)
                    docRef.set(articles)
                }).catch((err) => console.error("Fail"))
        });
    });

}

function coinmeme() {
    n = new Set()
    request("https://coinmeme.io", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="article-wrap"]').find('article > div > h3 > a').each(function () {

            var a = $(this).attr('href');
            if (!(n.has(a))) {
                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        //console.log(metadata["title"])
                        var lastIndex = metadata["title"].lastIndexOf("-");
                        var title = metadata["title"].substring(0, lastIndex)
                        if (lastIndex == -1) {
                            title = metadata["title"];
                        }
                        if (!(sources.contains(metadata["publisher"]))) {
                            console.log(metadata["publisher"])
                            //console.log("ye")
                            var docRef = db.collection("articles").doc()
                            var articles = {
                                "id": docRef.id,
                                "site": metadata["publisher"],
                                "url": metadata["url"],
                                "title": title,
                                "image": metadata["image"],
                                "date-a": metadata["date"]
                            }
                            //console.log(articles)
                            docRef.set(articles)
                        }


                    }).catch((err) => console.error("Fail"))
            }
            n.add(a)
        });
    });

}

function Suppoman() {
    console.log("ss")
    nightmare
        //load a url
        .goto('https://www.youtube.com/user/Suppoman2011/videos')
        //wait for an element identified by a CSS selector
        //in this case, the body of the results
        .wait('#main')

        //execute javascript on the page
        //here, the function is getting the HREF of the first search result
        .evaluate(function () {
            return [].slice.call(document.querySelectorAll('#thumbnail')).map(function (element) {

                console.log(element, element.href);
                return element.href;
            });
        })
        //end the Nightmare instance along with the Electron instance it wraps
        .end()
        //run the queue of commands specified, followed by logging the HREF
        .then(function (result) {
            console.log(result);
        })
        //catch errors if they happen
        .catch(function (error) {
            console.error('an error has occurred: ' + error);
        });



    request("https://www.youtube.com/user/Suppoman2011/videos", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('a[class="yt-simple-endpoint inline-block style-scope ytd-thumbnail"]').each(function () {

            var a = $(this).attr('href');
            console.log(a)
            og
                .scrapeUrl(a)
                .then((metadata) => {
                    var lastIndex = metadata["title"].lastIndexOf("-");
                    var title = metadata["title"].substring(0, lastIndex);

                    var articles = {
                        "site": metadata["publisher"],
                        "url": metadata["url"],
                        "title": title,
                        "image": metadata["image"],
                        "date-a": metadata["date"]
                    }
                    console.log(articles)
                    //db.collection("bitcoin").add(articles)
                }).catch((err) => console.error("Fail"))
        });
    });
}

function theblockchain() {
    var links = ["http://www.the-blockchain.com/news/page/2/", "http://www.the-blockchain.com/news/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('div[class="td-block-span6"]').find('div > div > h3 > a').each(function () {

                var a = $(this).attr('href');
                console.log(a)
                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        //console.log(metadata["title"])


                        var docRef = db.collection("articles").doc()
                        var articles = {
                            "id": docRef.id,
                            "site": metadata["publisher"],
                            "url": metadata["url"],
                            "title": metadata["title"],
                            "image": metadata["image"],
                            "date-a": metadata["date"]
                        }
                        //console.log(articles)
                        docRef.set(articles)
                    }).catch((err) => console.error("Fail"))
            });
        });
    }
}

function youtube() {
    request({
        uri: 'https://www.youtube.com/user/Suppoman2011/videos'
    }, function (err, response, body) {
        var self = this;
        self.items = new Array(); //I feel like I want to save my results in an array

        //Just a basic error check
        if (err && response.statusCode !== 200) {
            console.log('Request error.');
        }

        //Send the body param as the HTML code we will parse in jsdom
        //also tell jsdom to attach jQuery in the scripts
        jsdom.env({
            html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js']
        }, function (err, window) {
            //Use jQuery just as in any regular HTML page
            var $ = window.jQuery,
                $body = $('body'),
                $videos = $body.find('.style-scope ytd-grid-renderer');

            //I know .video-entry elements contain the regular sized thumbnails
            //for each one of the .video-entry elements found
            $videos.each(function (i, item) {

                //I will use regular jQuery selectors
                var $a = $(item).children('a'),

                    //first anchor element which is children of our .video-entry item
                    $title = $(item).find('.video-title .title').text(),


                    $img = $a.find('yt-img-shadow.img'); //thumbnail

                //and add all that data to my items array
                self.items[i] = {
                    href: $a.attr('href'),
                    title: $title.trim(),

                    //there are some things with youtube video thumbnails, those images whose data-thumb attribute
                    //is defined use the url in the previously mentioned attribute as src for the thumbnail, otheriwse
                    //it will use the default served src attribute.
                    thumbnail: $img.attr('data-thumb') ? $img.attr('data-thumb') : $img.attr('src'),
                    urlObj: url.parse($a.attr('href'), true) //parse our URL and the query string as well
                };
            });

            //let's see what we've got
            console.log(self.items);
        });
    });
}

function bitmag() {

    request("https://bitcoinmagazine.com", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="col-lg-5 push-lg-10 category-list--date"]').find('a').each(function () {

            var a = $(this).attr('href');
            og
                .scrapeUrl("https://bitcoinmagazine.com" + a)
                .then((metadata) => {
                    var lastIndex = metadata["title"].lastIndexOf("-");
                    var title = metadata["title"].substring(0, lastIndex);

                    var docRef = db.collection("articles").doc()
                    var articles = {
                        "id": docRef.id,
                        "site": metadata["publisher"],
                        "url": metadata["url"],
                        "title": metadata["title"],
                        "image": metadata["image"],
                        "date-a": metadata["date"]
                    }
                    //console.log(articles)
                    docRef.set(articles)
                }).catch((err) => console.error("Fail"))
        });
    });

}

function bitcoinist() {
    var links = ["http://bitcoinist.com/category/blockchain-technology/", "http://bitcoinist.com/category/altcoins/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('a[class="featured-image"]').each(function () {

                var a = $(this).attr('href');
                console.log(a)
                og
                    .scrapeUrl(a)
                    .then((metadata) => {
                        console.log(metadata["title"])


                        var docRef = db.collection("articles").doc()
                        var articles = {
                            "id": docRef.id,
                            "site": metadata["publisher"],
                            "url": metadata["url"],
                            "title": metadata["title"],
                            "image": metadata["image"],
                            "date-a": metadata["date"]
                        }
                        //console.log(articles)
                        docRef.set(articles)
                    }).catch((err) => console.error("Fail"))
            });
        });
    }
}

bitcoinist()
bitcoin()
bitmag()
theblockchain()
coindesk()
blockonomi()
coinmeme()
console.log("Okai")
//blockonomi()