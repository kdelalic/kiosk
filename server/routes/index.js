var express = require('express');
var router = express.Router();
var serviceAccount = require("../path/kiosk-f1a66-firebase-adminsdk-434m3-8468b3596a.json");


var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
var og = require('open-graph');
var jwt = require("jwt-simple");  
var users = require("./users.js");  
var cfg = require("./config.js"); 
var auth = require("./auth")(); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kiosk-f1a66.firebaseio.com"
});


var db = admin.firestore();

/* GET home page. */
d = {};

db.getCollections().then(collections => {

 for (let c of collections) {
	db.collection(c.id).get()

    .then((snapshot) => {
        snapshot.forEach((doc) => {
        	var i = {}
        	d[doc.id] = doc.data()
        });
           
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
  	 
    }

});

router.get('/api/content', function(req, res, next) {
    res.status(200).json(d);
});

router.get("/", function(req, res) {  
    res.json({
        status: "My API is alive!"
    });
});

router.post("/api/user", function(req, res) {  
    console.log(req.body.uid)
});

router.post("/token", function(req, res) {  
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});
console.log("OKK")
module.exports = router;

