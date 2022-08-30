require('dotenv').config();

const Snoowrap = require("snoowrap");

const {CommentStream} = require("snoostorm");

const wattpad = require("./wattpad.js");

const BOT_START = Date.now() / 1000;

try{

        // async function main () {
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
                    console.log("respnse", response);
                    // const test = async () => {    
                        console.log("in async func test")
                        const reply = await buildCommentReply(response);
                        console.log(reply);
                        // comment.reply("resp" + reply.toString());
                    // }
                    // buildCommentReply(response, res => comment.reply(res)).then(result =>{
                    //     if (result){
                    //         console.log("sucess");
                    //     }
                    // }
                    // ).catch(ex => {
                    //     console.error(ex);
                    // });
                    // // .then(replyBody => 
                    //     {
                    //     // buildCommentReplies(response).then((replyBody) => {
                    //     console.log(response);
                    //     console.log("build comment reply called...")
                    // console.log(replyBody)});
                    // if(!replyBody){
                    //     replyBody = ["test"];
                    // }
                    
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
    
            // (async function buildCommentReplies() {
            //     const resData=[];
            //     storyTitles.forEach( title => {
            //         res = await wattpad(title);
            //         resData.push(res);
            //     });
            // })();
            const buildCommentReply = async (storyTitles) => {
                const resData=[];
                for (const title of storyTitles){
                    const res= await wattpad(title);
                    // wattpad(title).then((res) => {
                        resData.push(res); 
                }
                // storyTitles.forEach( async (title) => {
                //     // const trst2 = async () => {
                     
                //     const res= await wattpad(title);
                //     // wattpad(title).then((res) => {
                //         resData.push(res);   
                //     // }
                //     // res= await wattpad(title);
                //     // // wattpad(title).then((res) => {
                //     //     resData.push(res);
                //     // }
    
                //     // );
                //     // console.log(resData);
                //     // callback(resData);
                // });
                return resData;
            };
            
        // };

        // main();
        // const stories=await wattpad("testuserwp");

        // console.log("stoies:", stories, "stories");
    }


catch (ex){
    console.error(ex);
}
