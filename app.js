require('dotenv').config();

const Snoowrap = require("snoowrap");

const {CommentStream} = require("snoostorm");

const wattpad = require("./wattpad.js");

const BOT_START = Date.now() / 1000;

try{
    // (async () => {

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
            if(comment.created_utc > BOT_START && canSummon(comment.body))
            {
                response = getCommentData(comment.body);
                replyBody = buildCommentReply(response);
                console.log(replyBody);
                // comment.reply(response);
            }
            });
    
        const getCommentData = (comment) => {
            const re= /{([\w-]+( [\w]+)*)[ ]?}/gm;
            comment = comment.replace("u/wattpadbot", "");
            const matches = comment.matchAll(re);
            const storyTitles= [];

            for (const match of matches) {
                storyTitles.push(match[1])
            }
            return storyTitles;
        };

        
        const buildCommentReply = (storyTitles) => {
            storyTitles.forEach( title => {
                wattpad(title).then( res => {
                    if(res){
                        return res;
                    }
                });
            });
        };
        
        // const stories=await wattpad("testuserwp");

        // console.log("stoies:", stories, "stories");
    }


catch (ex){
    console.error(ex);
}
