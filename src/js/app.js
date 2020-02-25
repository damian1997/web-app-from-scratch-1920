import { getForkers, getCommits, getIssues } from './components/api'
import { cleanGithubData, sortCommits } from './components/data'

import Routie from './libraries/routie'

import Component from './components/baseComponent.mjs'
import Header from './components/header.mjs'
import Overview from './components/overview.mjs'
import Detail from './components/detail.mjs'
import Router from './components/router.mjs'

import { createVirtualElement, renderElementToHTML, renderComponent, diff, } from './virtualdom/virtualdom.mjs'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.getResults = this.getResults.bind(this)
		this.header = new Header({ getResults: this.getResults.bind() })
		this.overview = new Overview()
		this.detail = new Detail()
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
						this.detail.createVirtualComponent({commitid: 'meessour&web-app-from-scratch-1920&commits&749c2c955eeaaaf3593e78932fd111c121552294'}, state)
						//this.overview.createVirtualComponent(props, state)
					]
				})
			]
		})
	}
}

async function foo () {
	const res = await fetch('http://localhost:5000/web-app-from-scratch-f6a7f/us-central1/scraper', { 
		method: 'POST', 
		body: JSON.stringify('https://raw.githubusercontent.com/meessour/web-app-from-scratch-1920/749c2c955eeaaaf3593e78932fd111c121552294/week-2/public/css/styles.css') 
	});
	
	const data = await res.json();
	console.log(data)
}

foo()

const render = (virtualNode, parent) => {
	diff(undefined, undefined, virtualNode, parent)
}

render(createVirtualElement(App),document.body)
