const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userTag: String,
    pulls: Number,
    lastCookie: Number,
    lastEpic: Number,
    daily: Boolean,
    crytals: Number,
    cookies: Array //TODO: change later
});