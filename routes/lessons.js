/**
 * Created by druppmann on 8/5/18.
 */
var express = require('express');
var router = express.Router();
var firebase = require('firebase');


/* GET lessons listing. */

var config = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DBURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGE,
    messagingSenderId: process.env.SENDERID
};

var app = firebase.initializeApp(config);

router.get('/', function(req, res, next) {
    var mail = req.query.email.replace('.', ',');
    var reset = req.query.reset;
    var update = req.query.id;
    var type = req.query.type;
    if (mail === '') {
        res.send('Mail Address required');
    } else {
        if (reset === 'true') {
            initLessons(mail);
        } else if (update > '') {
            updateLesson(mail, update, type, res);
        } else {
            getLessons(mail, res);
        }
    }
});

module.exports = router;

function getLessons(mail, res) {
    firebase.database().ref('/users/' + mail).once('value').then(function(snapshot) {
        var lessons = (snapshot.val() && snapshot.val().lessons) || initLessons(mail);
        res.send(JSON.stringify(lessons));
    });
}

function initLessons(mail) {
    var lessons = [{type: 'free', date: '.', id: 0},{type: 'free', date: '.', id: 1},{type: 'free', date: '.', id: 2},{type: 'free', date: '.', id: 3},{type: 'free', date: '.', id: 4},{type: 'free', date: '.', id: 5},{type: 'free', date: '.', id: 6},{type: 'free', date: '.', id: 7},{type: 'free', date: '.', id: 8},{type: 'free', date: '.', id: 9}];

    firebase.database().ref('users/' + mail).set({
        lessons: lessons
    });
    console.log('new repo for: ' + mail + ' created');

    return lessons;
}

function updateLesson(mail, update, type, res) {
    var dater = new Date();
    var date = (dater.getDate() + 1) + '.' + (dater.getMonth() + 1);
    firebase.database().ref('users/' + mail + '/lessons/' + update).set({
        id: update,
        type: type,
        date: date
    });
    getLessons(mail, res);
}