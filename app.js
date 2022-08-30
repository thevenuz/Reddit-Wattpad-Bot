require('dotenv').config();

const Snoowrap = require("snoowrap");

const {CommentStream} = require("snoostorm");

const wattpad = require("./wattpad.js");

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
    
        stream.on("item", async (comment) => {
            if(comment.created_utc > BOT_START && canSummon(comment.body))
            {
                response = getCommentData(comment.body);
                const reply = await buildCommentReply(response);
                comment.reply(reply);
            }
            });
    
        const getCommentData = (comment) => {
            const re= /{([\w-]+( [\w]+)*)[ ]?}/gm;
            comment = comment.replace("u/wattpadbot", "");
            console.log(comment);
            const matches = comment.matchAll(re);
            const storyTitles= [];

            for (const match of matches) {
                storyTitles.push(match[1])
            }
            return storyTitles;
        };

        const buildCommentReply = async (storyTitles) => {
            const resData=[];
            let replyString="";
            for (const title of storyTitles){
                const res= await wattpad(title);
                // resData.push(res); 
                replyString =replyString + `**${res["title"]}** - [link](${res["url"]})\n\n^status: ^${res["status"]} ^| ^Reads: ^${res["stats"]["reads"]} ^| ^Votes: ^${res["stats"]["votes"]} ^| ^Chapters: ^${res["stats"]["parts"]}\n\n\n\n`;
            }
            return replyString;
        };
    }


catch (ex){
    console.error(ex);
}
