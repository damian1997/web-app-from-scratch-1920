import { getForkers, getCommits, getIssues } from './components/api'
import { readStorage, clearStorage, addLocalstorageEntry } from './components/localstorage'
import { cleanGithubData, sortCommits } from './components/data'

import Routie from './libraries/routie'

import Component from './components/baseComponent.mjs'
import Header from './components/header.mjs'
import Overview from './components/overview.mjs'

import { createVirtualElement, renderElementToHTML, renderComponent, diff, } from './virtualdom/virtualdom.mjs'


export default class App extends Component {
	constructor(props) {
		super(props)
		this.getResults = this.getResults.bind(this)
		this.header = new Header({ getResults: this.getResults.bind() })
		this.overview = new Overview()
		this.state.results = []
	}

	async getResults({search}) {
		const apiBaseUrl = 'https://api.github.com/repos'
		const split_string = search.split('https://github.com/')	
		const finalstring = split_string[1].split('/')
		const fetchUrl = `${apiBaseUrl}/${finalstring[0]}/${finalstring[1]}`

		const forkers = await getForkers(apiBaseUrl,finalstring[0],finalstring[1])
			.then(async (entrys) => {
				return await getCommits(apiBaseUrl,entrys)
			})

		const cleanedForkers = await cleanGithubData(forkers)
			.then(async (entrys) => {
				return await sortCommits(entrys)
			})
		this.setState({results: cleanedForkers})
	}

	createVirtualComponent(props,state) {
		return createVirtualElement('div', {
			attributes: {
				class: 'app'
			},
			children: [
				this.header.createVirtualComponent(this.header.props,this.header.state),
				createVirtualElement('main', {
					children: [
						this.overview.createVirtualComponent(props, state)
					]
				})
			]
		})
	}
}

const render = (virtualNode, parent) => {
	diff(undefined, undefined, virtualNode, parent)
}

render(createVirtualElement(App),document.body)

Routie({
	'': function() {
		console.log('base route')
	},
	'commit/:id': function(id) {
		console.log(App)
		console.log('id route')
	}
})
