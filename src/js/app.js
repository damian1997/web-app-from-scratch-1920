import { getForkers, getCommits, getIssues } from './components/api.js'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'

init()
async function init() {
	const yetToBeDeterminedCheck = false 
	if(readStorage('forkers') && yetToBeDeterminedCheck == false) {
		console.log('Items found in storage ', readStorage('forkers'))
	} else {
		const apiSettings = {
			baseUrl: 'https://api.github.com/repos',
			forkedRepoOwner: 'cmda-minor-web',
			forkedRepo: 'web-app-from-scratch-1920'
		}
		const forkers = await getForkers(apiSettings.baseUrl,apiSettings.forkedRepoOwner,apiSettings.forkedRepo)
		const forkersCommits = await getCommits(apiSettings.baseUrl,forkers)
		const forkersCommitsIssues = await getIssues(apiSettings.baseUrl,forkersCommits)
		addLocalstorageEntry(forkers, 'forkers')
	}
}
