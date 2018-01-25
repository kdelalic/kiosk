var express = require('express');
var router = express.Router();
var serviceAccount = require("./path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");


var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('open-graph');



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kiosk-f1a66.firebaseio.com"
});


var db = admin.firestore();

/* GET home page. */
d = {};
//cid = [{"site" : "Coindesk", "id" : "4059a050tjcu9d591", "url" : "https://media.coindesk.com/uploads/2017/05/cropped-coindesk-new-favicon-192x192.png"},{"site" : "Bitcoin News", "id" : "4059a050tjcu9d58v", "url" : "https://news.bitcoin.com/wp-content/uploads/2017/07/btc_fav.png"}];
db.getCollections().then(collections => {

 for (let c of collections) {
    ///console.log(`Found collection with id: ${collection.id}`);
    //cid.push(c.id)
	db.collection(c.id).get()

    .then((snapshot) => {
        snapshot.forEach((doc) => {
        	var i = {}
        	d[doc.id] = doc.data()
        	//d.add(i);
        	 
        });
           
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
  	 
    }

});

//console.log(d)
router.get('/api/content', function(req, res, next) {
//res...render('index', { title: 'Express' });
//var s =Array.from(d)
res.status(200).json(d);
});

router.get("/token", function(req, res) {  
    res.json({
        status: "My API is alive!"
    });
});

app.listen(3000, function() {  
    console.log("My API is running...");
});
console.log("OKK")
module.exports = router;

