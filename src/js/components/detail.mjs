import Component from './baseComponent.mjs'
import { createVirtualElement, renderElementToHTML, renderComponent, diff, updateComponent } from '../virtualdom/virtualdom.mjs'

export default class Detail extends Component {
	constructor(props) {
		super(props)
	}

	createVirtualComponent(props, state) {
		console.log(state.results[0])
		if(state.results.length) {
			return createVirtualElement('section', {
				children: [
					...state.results[0].map((item) => {
						return createVirtualElement('h2', {
							children: [item.filename.toString()]
						})
					})
				]
			})

		} else {
			return createVirtualElement('section', {
				children: [
					'Loading'
				]
			})
		}
	}
}
