import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData } from './components/data'

init()
async function init() {
	const yetToBeDeterminedCheck = false 
	if(readStorage('forkersdata') && yetToBeDeterminedCheck == false) {
		console.log('you are in if ');
		console.log(readStorage('forkersdata'));
	} else {
		const apiSettings = {
			baseUrl: 'https://api.github.com/repos',
			forkedRepoOwner: 'cmda-minor-web',
			forkedRepo: 'web-app-from-scratch-1920'
		}
		const forkers = await getForkers(apiSettings.baseUrl,apiSettings.forkedRepoOwner,apiSettings.forkedRepo)
			.then(async (entrys) => {
				return await getCommits(apiSettings.baseUrl,entrys)
			})
			.then(async (entrys) => {
				return await getIssues(apiSettings.baseUrl,entrys)
			})
		const cleanedForkers = await cleanGithubData(forkers)
		addLocalstorageEntry(forkers,'forkersdata')
	}
}
