const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    pulls: Number,
    lastCookie: Number,
    lastEpic: Number,
    daily: Boolean,
    crytals: Number
    //TODO: cookies
});

module.exports = mongoose.model("User", userSchema);
