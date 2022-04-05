const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    id: String,
    ss: Number
});

const userSchema = new mongoose.Schema({
    userId: String,
    crystals: Number,
    pulls: Number,
    lastCookie: Number,
    lastEpic: Number,
    daily: Date,
    streak: Number,
    cookies: { //k: cookie id, v: ss count
        common: [ { id: String, ss: Number } ],
        rare:  [ { id: String, ss: Number } ],
        epic:  [ { id: String, ss: Number } ],
        legend:  [ { id: String, ss: Number } ],
        ancient:  [ { id: String, ss: Number } ],
        size: Number
    }
});

module.exports = {
    user: mongoose.model('User', userSchema),
};
