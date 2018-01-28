var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('scrape-meta');
var express = require("express");
var bodyParser = require('body-parser');
var sleep = require('system-sleep');
var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: false
  });

nightmare
  //load a url
  .goto('https://www.youtube.com/user/Suppoman2011/videos')
  //wait for an element identified by a CSS selector
  //in this case, the body of the results
  .wait('#main')
  //execute javascript on the page
  //here, the function is getting the HREF of the first search result
  .evaluate(function() {
    return document.querySelector('#thumbnail')
      .href;
  })
  //end the Nightmare instance along with the Electron instance it wraps
  .end()
  //run the queue of commands specified, followed by logging the HREF
  .then(function(result) {
    console.log(result);
  })
  //catch errors if they happen
  .catch(function(error){
    console.error('an error has occurred: ' + error);
  });


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');
app.use(express.static('public'));

var serviceAccount = require("../path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kiosk-f1a66.firebaseio.com"
});

var db = admin.firestore();

var sources = ["CoinDesk", "Bitcoin News"]

function coindesk(){
    var n = new Set();
    request("https://www.coindesk.com/", function(error, response, body) {
  if(error) { return  console.error('There was an error!'); }

  var $ = cheerio.load(body);

  $('a').each(function() {
    
    
    var articls = $(this).attr('class');
    if (articls === "fade"){
        
        let link = $(this).attr('href')
        
        if (!(n.has(link))){
            og
            .scrapeUrl(link)
            .then((metadata) => {
                var lastIndex = metadata["title"].lastIndexOf("-");
                var title = metadata["title"].substring(0, lastIndex);

                var articles = {
                "site" : metadata["publisher"],
                "url" : metadata["url"],
                "title" : title,
                "image" : metadata["image"],
                "date-a" : metadata["date"]
                }
                console.log(articles)  
                //db.collection("coindesk").add(articles)
            }).catch((err) => console.error("Fail"))
  
        } 
        n.add(link)
    }
    
  });
});
    
}

function bitcoin(){

    request("https://news.bitcoin.com/", function(error, response, body) {
  if(error) { return  console.error('There was an error!'); }

  var $ = cheerio.load(body);

  $('div[class="td_module_mx3 td_module_wrap td-animation-stack"]').find('div > a').each(function() {
      
      var a =$(this).attr('href');
        og
        .scrapeUrl(a)
        .then((metadata) => {
            var lastIndex = metadata["title"].lastIndexOf("-");
            var title = metadata["title"].substring(0, lastIndex);
            
            var articles = {
                "site" : metadata["publisher"],
                "url" : metadata["url"],
                "title" : title,
                "image" : metadata["image"],
                "date-a" : metadata["date"]
            }
            console.log(articles)
            //db.collection("bitcoin").add(articles)
        }).catch((err) => console.error("Fail"))
  });
});
    
}


function blockonomi(){
    var links = ["https://blockonomi.com/page/2/", "https://blockonomi.com/"]
    for (let c of links){
    request(c, function(error, response, body) {
      if(error) { return  console.error('There was an error!'); }
    
      var $ = cheerio.load(body);
    
      $('a[class="grid-thumb-image"]').each(function() {
          
          var a =$(this).attr('href');
          og
          .scrapeUrl(a)
          .then((metadata) => {
                //console.log(metadata["title"])
    
              
              var articles = {
                  "site" : metadata["publisher"],
                  "url" : metadata["url"],
                  "title" : metadata["title"],
                  "image" : metadata["image"],
                  "date-a" : metadata["date"]
              }
              console.log(articles)
              db.collection("bitcoin").add(articles)
          }).catch((err) => console.error("Fail"))
    });
      });
    }
        }

function cointele(){

        request("https://cointelegraph.com/", function(error, response, body) {
          if(error) { return  console.error('There was an error!'); }
        
          var $ = cheerio.load(body);
            
          $('.header').filter(function(){
              console.log($(this))
              var a =$(this).attr('href');
              
                og
                .scrapeUrl(a)
                .then((metadata) => {
                    var lastIndex = metadata["title"].lastIndexOf("-");
                    var title = metadata["title"].substring(0, lastIndex);
                    
                    var articles = {
                        "site" : metadata["publisher"],
                        "url" : metadata["url"],
                        "title" : title,
                        "image" : metadata["image"],
                        "date-a" : metadata["date"]
                    }
                    console.log(articles)
                    //db.collection("bitcoin").add(articles)
                }).catch((err) => console.error("Fail"))
          });
        });
            
    }

function coinmeme(){
    n = new Set()
        request("https://coinmeme.io", function(error, response, body) {
      if(error) { return  console.error('There was an error!'); }
    
      var $ = cheerio.load(body);
    
      $('div[class="article-wrap"]').find('article > div > h3 > a').each(function() {
          
          var a =$(this).attr('href');
          if (!(n.has(a))){
            og
            .scrapeUrl(a)
            .then((metadata) => {
                //console.log(metadata["title"])
                var lastIndex = metadata["title"].lastIndexOf("-");
                var title = metadata["title"].substring(0, lastIndex)
                if (lastIndex == -1){
                     title = metadata["title"];
                }
                if (!(sources.contains(metadata["publisher"]))){
                   // console.log(sources.contains(metadata["publisher"]))
                    //console.log("ye")
                        var articles = {
                            "site" : metadata["publisher"],
                            "url" : metadata["url"],
                            "title" : title,
                            "image" : metadata["image"],
                            "date-a" : metadata["date"]
                        }
                    //db.collection("bitcoin").add(articles)
                }
                
                
            }).catch((err) => console.error("Fail")) }
            n.add(a)
      });
    });
        
    }

function Suppoman(){




    request("https://www.youtube.com/user/Suppoman2011/videos", function(error, response, body) {
      if(error) { return  console.error('There was an error!'); }
    
      var $ = cheerio.load(body);

      $('a[class="yt-simple-endpoint inline-block style-scope ytd-thumbnail"]').each(function() {
          
          var a =$(this).attr('href');
          console.log(a)
            og
            .scrapeUrl(a)
            .then((metadata) => {
                var lastIndex = metadata["title"].lastIndexOf("-");
                var title = metadata["title"].substring(0, lastIndex);
                
                var articles = {
                    "site" : metadata["publisher"],
                    "url" : metadata["url"],
                    "title" : title,
                    "image" : metadata["image"],
                    "date-a" : metadata["date"]
                }
                console.log(articles)
                //db.collection("bitcoin").add(articles)
            }).catch((err) => console.error("Fail"))
      });
    });
}

Suppoman()
console.log("Okai")
//blockonomi()





