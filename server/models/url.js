var mongoose = require('mongoose');
var {urlSchema} = require('../db/mongose');

var Url = mongoose.model('Url', urlSchema);
module.exports = {Url};
