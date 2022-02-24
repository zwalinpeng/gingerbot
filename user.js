const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    crystals: Number,
    pulls: Number,
    lastCookie: Number,
    lastEpic: Number,
    daily: Boolean,
    //TODO: cookies
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
            console.log('no such user')
            return null;
        }
        else {
            console.log('user found');
            return user[0];
        }
    }
};
