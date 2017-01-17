var https = require('https');

module.exports = function getGoogleResults(url) {
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