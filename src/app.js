require('dotenv').config();

const Snoowrap = require("snoowrap");

const {CommentStream} = require("snoostorm");

const wattpad = require("./wattpad.js");
const logger = require("./logger.js");

const BOT_START = Date.now() / 1000;


try{
        logger.debug("app started....");
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
                logger.info(`new comment received : ${comment.body}`);

                const stories = getStoriesFromComment(comment.body);
                const authors = getAuthorsFromComment(comment.body);
                //response = getCommentData(comment.body);
                const reply = await buildCommentReply(stories, authors);

                logger.info(`Sending reply for comment: ${comment.body}, Reply: ${reply}`);

                if (reply){
                    comment.reply(reply);
                }
                else{
                    logger.error(`No response found for comment : ${comment.body}`);
                }
            }
            });

        const getStoriesFromComment = (comment) => {
            const re= /{([\w-]+( [\w-]+)*)[ ]?}/gm;
            comment = comment.replace("u/wattpadbot", "");
            
            const matches = comment.matchAll(re);
            const storyTitles= [];

            for (const match of matches) {
                storyTitles.push(match[1])
            }

            logger.debug(`For comment: ${comment}, story titles: ${storyTitles}`);

            return storyTitles;
        };

        const getAuthorsFromComment = (comment) => {
            const re= /<([\w-]+( [\w-]+)*)[ ]?>/gm;
            comment = comment.replace("u/wattpadbot", "");
            
            const matches = comment.matchAll(re);
            const authorNames= [];

            for (const match of matches) {
                authorNames.push(match[1])
            }

            logger.debug(`For comment: ${comment}, author names: ${authorNames}`);

            return authorNames;
        };

        const buildCommentReply = async (storyTitles, authorNames) => {

            logger.debug(`Story titles: ${storyTitles} and Author names: ${authorNames}`);

            const resData=[];
            let replyString="";
            for (const title of storyTitles){
                const res= await wattpad.getStoryData(title);
                // resData.push(res); 
                if(res){
                    replyString =replyString + `**${res["title"]}** - [\[link]\](${res["url"]})\n\n**^(status: ${res["status"]} | Reads: ${res["stats"]["reads"]} | Votes: ${res["stats"]["votes"]} | Chapters: ${res["stats"]["parts"]})**\n\n\n\n`;
                }
            }

            for (const author of authorNames)
            {
                const authorResult= await wattpad.getAuthorData(author);

                if (authorResult){
                    replyString =replyString + `**${authorResult["name"]}** - [\[link]\](${authorResult["url"]})\n\n**^(Stories: ${authorResult["stats"]["stories"]} | Followers: ${authorResult["stats"]["followers"]})**\n\n\n\n`;
                }
            }
            
            if (replyString){
                replyString = addFooter(replyString);
            }

            return replyString;
        };

        const addFooter = (reply) => {
            reply = reply + "\n\n\n\n___\n\n";
            const footer = "**^(commands: {story}, <author> |)**[**^(Feedback)**](https://www.reddit.com/message/compose/?to=wattpadbot)";
            reply = reply + footer;

            return reply;
        };

    }


catch (ex){
    logger.error(`Exception occured in app.js - Exception: ${ex}`);
    console.log(ex);
}
