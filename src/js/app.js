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
	}
		
	class App extends Component {
		constructor(props) {
			super(props)
			this.state.header = new Header({parseSearchUrl: this.parseSearchUrl.bind(this)})
			this.state.overview = new Overview()
			this.state.foo = 'bar'
		}
			
		async parseSearchUrl({search}) {
			// FETCH DATA HERE 
			// TODO REFACTOR STRING MANIPULATION
			const split_string = search.split('https://github.com/')	
			const finalstring = split_string[1].split('/')
			const fetchUrl = `${apiSettings.baseUrl}/${finalstring[0]}/${finalstring[1]}`

			const forkers = await getForkers(apiSettings.baseUrl,finalstring[0],finalstring[1])
				.then(async (entrys) => {
					console.log(entrys);
					return await getCommits(apiSettings.baseUrl,entrys)
				})

			const cleanedForkers = await cleanGithubData(forkers)
				.then(async (entrys) => {
					return await sortCommits(entrys)
				})

			console.log(cleanedForkers);
		}

		createVirtualComponent(props,state) {
			return createVirtualElement('div', {
				children: [
					state.header.createVirtualComponent(),
					state.overview.createVirtualComponent()
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
