const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});
const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');

const scrapeMetatags = (text) => {
    const urls = Array.from( getUrls(text) );

    const requests = urls.map(async url => {

        const res = await fetch(url);

        const html = await res.text();
        const $ = cheerio.load(html);

        return { html } 
    });


    return Promise.all(requests);

}

exports.scraper = functions.https.onRequest( async (request, response) => {

    cors(request, response, async () => {

        const body = JSON.parse(request.body);

        const data = await scrapeMetatags(body);

    });
});

exports.helloWorld = functions.https.onRequest((req, res) => {
	res.send('Hello from firebase functions')
})
