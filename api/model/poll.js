var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
    month: String,
    details: {
        venue: String,
        date: Date,
        users:[String]
    }
});

module.exports = mongoose.model('polls', voteSchema);
