import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData, sortCommits } from './components/data'
import Routie from './libraries/routie'

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
		//.then(async (entrys) => {
			//return await getIssues(apiSettings.baseUrl,entrys)
		//})
	const cleanedForkers = await cleanGithubData(forkers)
		.then(async (entrys) => {
			return await sortCommits(entrys)
		})
	Routie({
		'home': function() {
			console.log('SUP HOME')
		},
		'about': function() {
			console.log('Sup ABOUT');
		}
	});
}
