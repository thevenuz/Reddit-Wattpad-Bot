const axios= require("axios");
const cheerio = require("cheerio");

try{    
    const headers= {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'};
    const searchPrefix = "https://www.wattpad.com/search/";
    const domain = "https://www.wattpad.com";
    
    const getStoryLink= async (storyTitle) => {
        const searchLink = searchPrefix + storyTitle;
        const responseData=[];

        const res = await axios.get(searchLink, {
            headers: headers
        });
        const htmldata= res.data;
        const $ = cheerio.load(htmldata);
        console.log("get story called");
        const values = $('.story-card-container .list-group-item');

        for (const value of values)
        {
            const storyURL= $(value).children('a').attr('href');
            const storyInfo = $(value).children('.story-card').children('.story-card-data').children('.story-info');
            const storyTitle= $(storyInfo).children('.title').text();
            const storyStatus = $(storyInfo).children('.icon-bar').children('.completed').children('.tag-item').text();
            const storyStats = $(storyInfo).children('.new-story-stats').children();
            const stats = {};

            for (const stat of storyStats){
                const statType = $(stat).children('.stats-label').children('.stats-label__text').text().toLowerCase();//children('.stats-label__text').text();
                const statValue = $(stat).children('.icon-container').children('.tool-tip').children('.stats-value').text().toLowerCase();
                stats[statType] = statValue;
            }
            const jsonData = {
                "title": storyTitle,
                "url" : domain + storyURL,
                "status" : storyStatus,
                "stats" : stats
            };
            console.log(jsonData)
            return jsonData;

            // responseData.push(jsonData);
        }
        // return responseData;
    }   

    module.exports = getStoryLink;
}

catch (ex){
    console.log(ex);
}




