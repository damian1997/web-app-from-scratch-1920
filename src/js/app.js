import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData, sortCommits } from './components/data'
import Routie from './libraries/routie'

import Component from './components/baseComponent.mjs'
import Header from './components/header.mjs'
import Overview from './components/overview.mjs'

import { createVirtualElement, renderElementToHTML, renderComponent } from './virtualdom/virtualdom.mjs'
//import diff from './virtualdom/diff'


init()
async function init() {
	const apiSettings = {
		baseUrl: 'https://api.github.com/repos',
		forkedRepoOwner: 'cmda-minor-web',
		forkedRepo: 'web-app-from-scratch-1920'
	}
		
	//const forkers = await getForkers(apiSettings.baseUrl,apiSettings.forkedRepoOwner,apiSettings.forkedRepo)
		//.then(async (entrys) => {
			//return await getCommits(apiSettings.baseUrl,entrys)
		//})

	//const cleanedForkers = await cleanGithubData(forkers)
		//.then(async (entrys) => {
			//return await sortCommits(entrys)
		//})
	
	class App extends Component {
		createVirtualComponent() {
			return createVirtualElement('div', {
				children: [
					createVirtualElement(Header),
					createVirtualElement(Overview)
				]
			})
		}
	}

	renderComponent(new App(), document.body)

	//Routie({
		//// Default route	
		//'': function() {
		//},
		//'home': function() {
			//console.log('SUP HOME')
		//},
		//'about': function() {
			//console.log('Sup ABOUT')
		//}
	//})
}
