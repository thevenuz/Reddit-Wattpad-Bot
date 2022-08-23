require('dotenv').config();

const Snoowrap = require("snoowrap");

const {CommentStream} = require("snoostorm");

const BOT_START = Date.now() / 1000;

try{
    
    const r = new Snoowrap({
        userAgent: 'reddit-wattpad-bot-test',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        username: process.env.REDDIT_USER,
        password: process.env.REDDIT_PASS
    });

    const canSummon = (msg) => {
        return msg && msg.toLowerCase().includes('u/wattpadbot');
    };

    const stream = new CommentStream(r, { subreddit: "mytestingspacewpad", results: 1 });

    console.log("triggered....");

    stream.on("item", comment => {
        console.log("reached");
        console.log(comment.body);
        if(comment.created_utc < BOT_START) return;
        if(!canSummon(comment.body)) return;
        comment.reply("reply from bot!");
});
}

catch (ex){
    console.log(ex);
}