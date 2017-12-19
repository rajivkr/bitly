const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const path = require('path');
const moment = require('moment');
const {mongoose, autoInc} = require('./db/mongose');
const config = require('./config/config');

var {Url} = require('./models/url');
var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join('public')));

app.get('/', (req, res) => {
    "use strict";
    const fileName = 'index.html';

    const options = {
        root: path.join('public'),
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.post('/url', (req, res) => {
    var url = new Url({
        input_url: req.body.input_url,
        validity: req.body.validity,
        dateAdded: moment()
    });

    let shortUrlObj = {};
    shortUrlObj.frontUrl = process.env.FRONT_URL;

    Url.find({input_url: req.body.input_url, validity: req.body.validity,}).then((urls) => {
        if (urls) {
            for (let i = 0, len = urls.length; i < len; i++) {
                let foundUrl = urls[i];
                if (moment().diff(foundUrl.dateAdded, 'days') < foundUrl.validity) {
                    shortUrlObj.url = foundUrl;
                    return res.send(shortUrlObj);
                }
            }
        }
        url.save().then((doc) => {
            shortUrlObj.url = doc;
            res.send(shortUrlObj);
        }, (e) => {
            res.status(400).send(e);
        });

    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/urls', (req, res) => {
    Url.find().then((urls) => {
        res.send({urls});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/:id', (req, res) => {
    var shortUrl = req.params.id;

    if (!shortUrl) {
        res.status(500).json({error: "Short Url parameter not found"});
    }

    Url.find({shortUrl: shortUrl}).then((urls) => {
        var url = urls[0];
        if (!url) {
            return res.status(404).send();
        }
        if (moment().diff(url.dateAdded, 'days') > url.validity) {
            return res.send("Url expired");
        }
        res.redirect(url.input_url);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
module.exports = {app};
