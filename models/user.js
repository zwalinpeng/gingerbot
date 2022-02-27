const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    crystals: Number,
    pulls: Number,
    lastCookie: Number,
    lastEpic: Number,
    daily: Date,
    streak: Number,
    cookies: { //k: cookie id, v: ss count
        type: Map,
        of: Number
    }
});

module.exports = {
    user: mongoose.model('User', userSchema),
    findUser: async function(userId){
        var user;
        try{
            user = await mongoose.model('User', userSchema).find({ userId: userId });
        } catch (err) {
            console.log(err);
        }
        if (user.length == 0){
            return null;
        }
        else {
            return user[0];
        }
    }
};
