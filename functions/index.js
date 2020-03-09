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

		const parsedJSON = JSON.parse(html)

		const files = parsedJSON.files.map(async (file) => {
			if(file.filename.includes('.js') || file.filename.includes('.css') || file.filename.includes('.scss') || file.filename.includes('.mjs') || file.filename.includes('.json') || file.filename.includes('md') || file.filename.includes('.yml')) {
				const res = await fetch(file.raw_url)

				const commitContents = await res.text()
				const commitContentssplit = commitContents.split(/\n/)

				return { filename: file.filename, filecontents: commitContentssplit, patch: file.patch }
			} else if(file.filename.includes('.svg')){
				return { filename: file.filename, commitFile: 'image', imagePath: file.raw_url}
			} else {
				return { filename: file.filename, commitFile: 'image', imagePath: file.raw_url }
			}
		})

        return Promise.all(files) 
    });

    return Promise.all(requests);

}

exports.scraper = functions.https.onRequest( async (request, response) => {
	cors(request, response, async () => {
    response.header('Access-Control-Allow-Origin', '*')
    reponse.header('Access-Control-Allow-Headers', '*')

		const body = JSON.parse(request.body);

		const data = await scrapeMetatags(body);

		response.send(data)
	});
});

