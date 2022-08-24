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

    stream.on("item", comment => {
        if(comment.created_utc < BOT_START) return;
        if(!canSummon(comment.body)) return;
        comment.reply("reply from bot!");

        if (canSummon(comment.body)){
            
        }
});
}

catch (ex){
    console.error(ex);
}
