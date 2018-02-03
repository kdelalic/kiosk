var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('scrape-meta');
var express = require("express");
var bodyParser = require('body-parser');
var urlMetadata = require('url-metadata')
var Nightmare = require('nightmare'),
    nightmare = Nightmare({
        show: false
    });
var vidinfo = require('youtube-info')
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

var sources = ["CoinDesk", "Bitcoin News","Bitcoin Magazine"]

function check(url) {
    // Create a query against the collection
    return new Promise(function (resolve, reject) {
        var queryRef = db.collection('articles').where('url', '==', url).get()
            .then((snapshot) => {
                var vd = {}
                snapshot.forEach((doc) => {
                    vd[doc.id] = doc.data()
                });
                resolve(vd)
            })
    })
}


function tags(link, tag, subtag) {
    return new Promise(function (resolve, reject) {
        var tags = []
        request(link, function (error, response, body) {

            if (error) {
                return console.error("error")
            }
            var $ = cheerio.load(body);
            $(tag).find(subtag).each(function () {
                var at = $(this).attr('href')
                var title = at.substring(at.lastIndexOf("tag/") + 4, at.lastIndexOf("/"));
                tags.push(title)
            })
            resolve(tags)
        })

    })

}

module.exports = {
 coindesk: function coindesk() {
    console.log("coindesk")
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
                    check(link).then((vd) => {
                        if (Object.keys(vd).length === 0) {

                            og
                                .scrapeUrl(link)
                                .then((metadata) => {
                                    var lastIndex = metadata["title"].lastIndexOf("-");
                                    var title = metadata["title"].substring(0, lastIndex);
                                    var date = metadata["date"]
                                    if (date === null) {
                                        date = new Date();
                                    }


                                    tags(link, 'p[class="single-tags"]', 'a')
                                        .then((tg) => {
                                            //console.log(tg)
                                            var docRef = db.collection("articles").doc()
                                            var articles = {
                                                "id": docRef.id,
                                                "site": "1DIxE06gUQFTNskLX7Nd",
                                                "url": metadata["url"],
                                                "title": title,
                                                "image": metadata["image"],
                                                "date-a": date,
                                                "tags": tg
                                            }

                                            docRef.set(articles)



                                        }).catch((err) => console.error("pFail"))


                                }).catch((err) => console.error("Fail"))
                        }
                    }).catch((err) => console.error("Fail"))

                }
                n.add(link)
            }

        });
    });

},


bitcoin: function bitcoin() {
    console.log("bitcoin")
    request("https://news.bitcoin.com/", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="td_module_mx3 td_module_wrap td-animation-stack"]').find('div > a').each(function () {

            var a = $(this).attr('href');
            check(a).then((vd) => {
                if (Object.keys(vd).length === 0) {
                    og
                        .scrapeUrl(a)
                        .then((metadata) => {
                            var lastIndex = metadata["title"].lastIndexOf("-");
                            var title = metadata["title"].substring(0, lastIndex);
                            var date = metadata["date"]
                            if (date === null) {
                                date = new Date();
                            }

                            var docRef = db.collection("articles").doc()
                            var articles = {
                                "id": docRef.id,
                                "site": "Vd1wHH0eo9YPQYp0LUg2",
                                "url": metadata["url"],
                                "title": title,
                                "image": metadata["image"],
                                "date-a": date
                            }
                            //console.log(articles)
                            docRef.set(articles)

                        }).catch((err) => console.error("Fail"))
                }

            }).catch((err) => console.error("Fail"))
        });
    });

},


blockonomi : function blockonomi() {
    console.log("blockonomi")
    var links = ["https://blockonomi.com/page/2/", "https://blockonomi.com/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('a[class="grid-thumb-image"]').each(function () {

                var a = $(this).attr('href');
                check(a).then((vd) => {
                    if (Object.keys(vd).length === 0) {
                        console.log("S")
                        og
                            .scrapeUrl(a)
                            .then((metadata) => {
                                //console.log(metadata["title"])
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }

                                var docRef = db.collection("articles").doc()
                                var articles = {
                                    "id": docRef.id,
                                    "site": "Zt6pBLjPpUXDaA4j4IlJ",
                                    "url": metadata["url"],
                                    "title": metadata["title"],
                                    "image": metadata["image"],
                                    "date-a": date
                                }
                                //console.log(articles)
                                docRef.set(articles)

                            }).catch((err) => console.error("Fail"))
                    }
                }).catch((err) => console.error("Fail"))
            });
        });
    }
},

 cointele : function cointele() {
    
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

},

 coinmeme : function coinmeme() {
    console.log("coinmeme")
    n = new Set()
    request("https://coinmeme.io", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="article-wrap"]').find('article > div > h3 > a').each(function () {

            var a = $(this).attr('href');
            if (!(n.has(a))) {
                check(a).then((vd) => {
                    if (Object.keys(vd).length === 0) {
                       
                        og
                            .scrapeUrl(a)
                            .then((metadata) => {
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }
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
                                        "date-a": date
                                    }
                                    //console.log(articles)
                                    docRef.set(articles)

                                }

                            }).catch((err) => console.error("Fail"))
                    }
                }).catch((err) => console.error("Fail"))
            }
            n.add(a)
        });
    });

},

suppo : function Suppoman() {
    console.log("ss")
    var allvid= ""
    nightmare
        //load a url
        .goto('https://www.youtube.com/user/Suppoman2011/videos')
        //wait for an element identified by a CSS selector
        //in this case, the body of the results
        .wait('#main')
        //execute javascript on the page
        //here, the function is getting the HREF of all the search result
        .evaluate(function () {
            
            return [].slice.call(document.querySelectorAll('#thumbnail')).map(function (element) {
                return element.href;
            });
        })
        //end the Nightmare instance along with the Electron instance it wraps
        .end()
        //run the queue of commands specified, followed by logging the HREF
        .then(function (result) {
            allvid =result.map(function (element){ return element.substring(element.lastIndexOf("=")+1)})
        //     vidinfo(allvid[0]).then(function (videoInfo) {
        //         console.log(videoInfo);
        // }).catch(function (error){
        //             console.error(error)
        //         })
                //console.log(element)
            allvid.forEach(function (vid){
                vidinfo(vid).then(function (info){
                    metavid = {
                        "url" : info["url"],
                        "title" : info["title"],
                        "owner" : info["owner"],
                        "date-a" : info["datePublished"],
                        "duration" : info["duration"],
                        "views" : info["views"],
                        "genre" : info["genre"],
                        "image" : info["thumbnailUrl"]
                    }
                    console.log(metavid)
                }).catch(function (error){
                    console.error("error")
                })
            })
        })
        //catch errors if they happen
        .catch(function (error) {
            console.error('an error has occurred: ' + error);
        });
},
//suppo()

 theblockchain : function theblockchain() {
    console.log("theblockchain")
    var links = ["http://www.the-blockchain.com/news/page/2/", "http://www.the-blockchain.com/news/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('div[class="td-block-span6"]').find('div > div > h3 > a').each(function () {

                var a = $(this).attr('href');
                check(a).then((vd) => {
                    if (Object.keys(vd).length === 0) {

                        og
                            .scrapeUrl(a)
                            .then((metadata) => {
                                //console.log(metadata["title"])
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }

                                var docRef = db.collection("articles").doc()
                                var articles = {
                                    "id": docRef.id,
                                    "site": "IEuOxRvA5umqJpxVBUDE",
                                    "url": metadata["url"],
                                    "title": metadata["title"],
                                    "image": metadata["image"],
                                    "date-a": date
                                }
                                //console.log(articles)
                                docRef.set(articles)

                            }).catch((err) => console.error("Fail"))
                    }
                }).catch((err) => console.error("Fail"))
            });
        });
    }
},


bitmag : function bitmag() {
    console.log("bitmag")
    request("https://bitcoinmagazine.com", function (error, response, body) {
        if (error) {
            return console.error('There was an error!');
        }

        var $ = cheerio.load(body);

        $('div[class="col-lg-5 push-lg-10 category-list--date"]').find('a').each(function () {

            var a = $(this).attr('href');
            check("https://bitcoinmagazine.com" + a).then((vd) => {
                if (Object.keys(vd).length === 0) {

                    og
                        .scrapeUrl("https://bitcoinmagazine.com" + a)
                        .then((metadata) => {
                            var lastIndex = metadata["title"].lastIndexOf("-");
                            var title = metadata["title"].substring(0, lastIndex);
                            var date = metadata["date"]
                            if (date === null) {
                                date = new Date();
                            }

                            var docRef = db.collection("articles").doc()
                            var articles = {
                                "id": docRef.id,
                                "site": "YFHfBR51cP9pPcomXRec",
                                "url": metadata["url"],
                                "title": metadata["title"],
                                "image": metadata["image"],
                                "date-a": date
                            }
                            //console.log(articles)
                            docRef.set(articles)
                        }).catch((err) => console.error("Fail"))
                }
            })
        });
    });

},

bitcoinist : function bitcoinist() {
    console.log("bitcoinist")
    var links = ["http://bitcoinist.com/category/blockchain-technology/", "http://bitcoinist.com/category/altcoins/"]
    for (let c of links) {
        request(c, function (error, response, body) {
            if (error) {
                return console.error('There was an error!');
            }

            var $ = cheerio.load(body);

            $('a[class="featured-image"]').each(function () {

                var a = $(this).attr('href');
                //console.log(a)
                urlMetadata('https://www.coindesk.com/bitcoin-core-developers-join-mit-digital-currency-initiative/').then(
                    function (metadata) { // success handler

                    },
                    function (error) { // failure handler
                        console.log(error)
                    })
                check(a).then((vd) => {
                    if (Object.keys(vd).length === 0) {

                        og
                            .scrapeUrl(a)
                            .then((metadata) => {
                                //console.log(metadata["title"])
                                var lastIndex = metadata["title"].lastIndexOf("-");
                                var title = metadata["title"].substring(0, lastIndex);
                                var date = metadata["date"]
                                if (date === null) {
                                    date = new Date();
                                }
                                var docRef = db.collection("articles").doc()
                                var articles = {
                                    "id": docRef.id,
                                    "site": "UZUksRVofjXewHCGH46B",
                                    "url": metadata["url"],
                                    "title": title,
                                    "image": metadata["image"],
                                    "date-a": date
                                }
                                //console.log(articles)
                                docRef.set(articles)
                            }).catch((err) => console.error("Fail"))
                    }
                }).catch((err) => console.error("cFail"))
            });
        });
    }
}
}
//bitcoinist()
// bitcoin()
// bitmag()
// theblockchain()
// coindesk()
// blockonomi()
// coinmeme()


console.log("Okai")
//blockonomi()



// Promise interface
