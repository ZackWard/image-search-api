var dotenv = require('dotenv');
dotenv.config();

var express = require('express');
var app = express();
var getGoogleResults = require('./query-google');

var searchEndpoint = "https://www.googleapis.com/customsearch/v1?key=" + process.env.IMAGE_SEARCH_API_KEY + "&cx=" + process.env.IMAGE_SEARCH_CSE_ID + "&q=";
var searchUrl = searchEndpoint + process.argv[2] + "&safe=high&searchType=image&fields=items(link,snippet,image/contextLink,image/thumbnailLink)&start=10";

console.log("Google Custom Search Engine ID: " + process.env.IMAGE_SEARCH_CSE_ID);
console.log("Google Search API Key: " + process.env.IMAGE_SEARCH_API_KEY);

console.log("Searching for: " + process.argv[2]);

getGoogleResults(searchUrl)
    .then((json) => {console.log(json)})
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });