var dotenv = require('dotenv');
dotenv.config();
var https = require('https');

module.exports = function getGoogleResults(query, offset=1) {
    return new Promise(function (resolve, reject) {
        var searchEndpoint = "https://www.googleapis.com/customsearch/v1?key=" + process.env.IMAGE_SEARCH_API_KEY + "&cx=" + process.env.IMAGE_SEARCH_CSE_ID;
        var searchUrl = searchEndpoint + "&safe=high&searchType=image&fields=items(link,snippet,image/contextLink,image/thumbnailLink)&start=" + offset + "&q=" + query;
        https.get(searchUrl, (res) => {
            if (res.statusCode !== 200) {
                res.resume(); // Do this or we'll have a memory leak
                return reject("Error getting search results from Google! Status: " + res.statusCode);
            }
            if (!/^application\/json/.test(res.headers['content-type'])) {
                res.resume(); // Do this or we'll have a memory leak
                return reject("Response is not JSON!");
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                var result = JSON.parse(rawData);
                result = result.items.map((item) => {
                    return {
                        url: item.link,
                        snippet: item.snippet,
                        context: item.image.contextLink,
                        thumbnail: item.image.thumbnailLink
                    };
                });
                resolve(result);
            });
        }).on('error', (e) => reject(e));
    });
}