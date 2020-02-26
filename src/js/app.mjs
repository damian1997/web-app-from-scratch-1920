import { getForkers, getCommits, getIssues } from './components/api'
import { cleanGithubData, sortCommits } from './components/data'

import Component from './components/baseComponent.mjs'
import Header from './components/header.mjs'
import Overview from './components/overview.mjs'
import Detail from './components/detail.mjs'

import { createVirtualElement, renderElementToHTML, renderComponent, diff, updateComponent } from './virtualdom/virtualdom.mjs'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state.page = (props && props.page) ? new props.page() : new Overview()
		this.getResults = this.getResults.bind(this)
		this.scraper = this.scraper.bind(this)
		this.header = new Header({ getResults: this.getResults.bind() })
		this.state.results = []

		this.virtualElement = this.createVirtualComponent(this.props, this.state)
		this.base = renderElementToHTML(this.virtualElement)
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

		this.setState({results: cleanedForkers, page: this.state.page})
	}

	async scraper(id) {
		const splitstr = id.split('&')
		const res = await fetch('http://localhost:5000/web-app-from-scratch-f6a7f/us-central1/scraper', { 
			method: 'POST', 
			body: JSON.stringify(`https://api.github.com/repos/${splitstr[0]}/${splitstr[1]}/commits/${splitstr[2]}`) 
		})

		const data = await res.json()

		this.setState({detailresults: data, page: this.state.page, results: this.state.results})
	}

	changePage(page, id = undefined) {
		this.state.page = new page()
		if(id) {
			this.scraper(id)
		}
		updateComponent(this)
	}

	createVirtualComponent(props,state) {
		console.log(state)
		return createVirtualElement('div', {
			attributes: {
				class: 'app'
			},
			children: [
				this.header.createVirtualComponent(this.header.props,this.header.state),
				createVirtualElement('main', {
					children: [
						state.page.createVirtualComponent(state.page.props, this.state)
					]
				})
			]
		})
	}
}

