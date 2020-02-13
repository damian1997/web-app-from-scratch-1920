import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData, sortCommits } from './components/data'
import Routie from './libraries/routie'

import createElement from './virtualdom/createElement';
import render from './virtualdom/render'
import mount from './virtualdom/mount'
import diff from './virtualdom/diff'

import forkerConstruct from './components/forkerConstruct'

init()
async function init() {
	const apiSettings = {
		baseUrl: 'https://api.github.com/repos',
		forkedRepoOwner: 'cmda-minor-web',
		forkedRepo: 'web-app-from-scratch-1920'
	}
	const forkers = await getForkers(apiSettings.baseUrl,apiSettings.forkedRepoOwner,apiSettings.forkedRepo)
		.then(async (entrys) => {
			return await getCommits(apiSettings.baseUrl,entrys)
		})
	console.log(JSON.stringify(forkers[0],null,4));
		//.then(async (entrys) => {
			//return await getIssues(apiSettings.baseUrl,entrys)
		//})
	const cleanedForkers = await cleanGithubData(forkers)
		.then(async (entrys) => {
			return await sortCommits(entrys)
		})
	

	Routie({
		// Default route	
		'': function() {
			const constructedForkerChildren = []
			cleanedForkers.map(forker => {
				constructedForkerChildren.push(forkerConstruct(forker))
			})

			const createVirtualApp = () => createElement('main', {
				attrs: {
					id: 'app',
				},
				children: [
					createElement('section', {
						attrs: {
							class: 'forkers__overview'
						},
						children: constructedForkerChildren
					})
				],
			});
			let count = 0;
			const virtualApp = createVirtualApp();
			const $app = render(virtualApp);
			let $rootElement = mount($app, document.getElementById('app'));

			//setInterval(() => {
				//count++;
				//const virtualNewApp = createVirtualApp(count)
				//const patch = diff(virtualApp, virtualNewApp)
				
				//$rootElement = patch($rootElement)
				//console.log($rootElement);
			//}, 1000);
		},
		'home': function() {
			console.log('SUP HOME')
		},
		'about': function() {
			console.log('Sup ABOUT')
		}
	})
}
