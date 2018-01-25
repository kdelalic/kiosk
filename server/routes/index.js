var express = require('express');
var router = express.Router();
var serviceAccount = require("../path/muzle-fdf03-firebase-adminsdk-obm9k-046cf93299.json");


var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('open-graph');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://muzle-fdf03.firebaseio.com"
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
console.log("OKK")
module.exports = router;

