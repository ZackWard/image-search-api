var https = require('https');
var express = require('express');
var app = express();
var dotenv = require('dotenv');
dotenv.config();

var searchEndpoint = "https://www.googleapis.com/customsearch/v1?key=" + process.env.IMAGE_SEARCH_API_KEY + "&cx=" + process.env.IMAGE_SEARCH_CSE_ID + "&q=";
var searchUrl = searchEndpoint + process.argv[2] + "&safe=high&searchType=image&start=10";

console.log("Google Custom Search Engine ID: " + process.env.IMAGE_SEARCH_CSE_ID);
console.log("Google Search API Key: " + process.env.IMAGE_SEARCH_API_KEY);

console.log("Searching for: " + process.argv[2]);

getGoogleResults(searchUrl)
    .then((json) => {console.log(json)})
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });



function getGoogleResults(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume(); // Do this or we'll have a memory leak
                return reject("Error getting search results from Google!");
            }
            if (!/^application\/json/.test(res.headers['content-type'])) {
                res.resume(); // Do this or we'll have a memory leak
                return reject("Response is not JSON!");
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => resolve(JSON.parse(rawData)));
        }).on('error', (e) => reject(e));
    });
}