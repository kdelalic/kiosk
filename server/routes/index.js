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

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

function shuffle(originalArray) {
    var array = [].concat(originalArray);
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
var db = admin.firestore();

/* GET home page. */
// d = {};
// sources = ["bitcoinist","bitcoin","bitmag","theblockchain","coindesk","blockonomi","coinmeme"]
// db.getCollections().then(collections => {

//  //for (let c of collections) {

//     // if (sources.contains(collections.id)){
//     //     console.log(c.id)
//     db
//         .collection("articles")
//         //.orderBy('date-a')
//         .limit(20)
//         .offset(20)
//         .get()

//     .then((snapshot) => {
//         snapshot.forEach((doc) => {
//         	var i = {}
//             d[doc.id] = doc.data()
//         });

//     })
//     .catch((err) => {
//         console.log('Error getting documents', err);
//     });


// //}

// });

router.get('/api/content', function (req, res, next) {
    d = {};
    var currentPage = 1

    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    }
    console.log(currentPage)
    sources = ["bitcoinist", "bitcoin", "bitmag", "theblockchain", "coindesk", "blockonomi", "coinmeme"]
    db.getCollections().then(collections => {

        db
            .collection("articles")
            .limit(20)
            .offset(currentPage * 20)
            .get()

            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var i = {}
                    d[doc.id] = doc.data()
                });

                var k = Object.keys(d)

                var sk = shuffle(k)
                fd = {}
                for (var i = 0; i < sk.length; i++) {
                    fd[sk[i]] = d[sk[i]]
                }


                res.status(200).json(fd);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });


        //}

    });


});

router.get("/", function (req, res) {
    res.json({
        status: "My API is alive!"
    });
});

router.post("/api/user", auth.authenticate(), function (req, res) {
    //console.log(req.headers.refreshToken)
    admin.auth().verifyIdToken(req.headers.refreshToken)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            res.status(200).json(req)
        }).catch(function (error) {
            res.status(400).send("Error")
        });
});



// router.post("/token", function(req, res) {  
//     if (req.body.email && req.body.password) {
//         var email = req.body.email;
//         var password = req.body.password;
//         var user = users.find(function(u) {
//             return u.email === email && u.password === password;
//         });
//         if (user) {
//             var payload = {
//                 id: user.id
//             };
//             var token = jwt.encode(payload, cfg.jwtSecret);
//             res.json({
//                 token: token
//             });
//         } else {
//             res.sendStatus(401);
//         }
//     } else {
//         res.sendStatus(401);
//     }
// });
console.log("OKK")
module.exports = router;