const mongoose = require('mongoose');
const dbUrl = process.env.MONGOLAB_BLACK_URI || "mongodb://localhost:27017/UrlApp";
var Schema = mongoose.Schema;
const autoInc = require('mongoose-auto-increment');

var urlSchema = new Schema({
    input_url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    validity: {
        type: Number,
        default: null
    },
    dateAdded: {
        type: Date,
    }
});

var connection = mongoose.connect(dbUrl, () => {
    console.log(`connnecting to ${dbUrl}`);
});
autoInc.initialize(connection);
urlSchema.plugin(autoInc.plugin, {
    model: 'Url',
    field: 'shortUrl',
    startAt: 1000000,
    incrementBy: 1
});
module.exports = {
    mongoose,
    autoInc,
    urlSchema
};