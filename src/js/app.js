import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData } from './components/data'

init()
async function init() {
	const yetToBeDeterminedCheck = false 
		clearStorage('forkers')
	if(readStorage('forkers') && yetToBeDeterminedCheck == false) {
		clearStorage('forkers')
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
		console.log(forkers);
		//const forkersCommits = await getCommits(apiSettings.baseUrl,forkers)
		//const forkersCommitsIssues = await getIssues(apiSettings.baseUrl,forkersCommits)
		//addLocalstorageEntry(forkers, 'forkers')
	}
}
