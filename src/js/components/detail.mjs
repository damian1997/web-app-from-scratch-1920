import Component from './baseComponent.mjs'
import { createVirtualElement, renderElementToHTML, renderComponent, diff, } from '../virtualdom/virtualdom.mjs'

export default class Detail extends Component {
	constructor(props) {
		super(props)
		this.scraper()
	}

	scraper() {
	}

	createVirtualComponent(props, state) {
		
		console.log(props.commitid)
		return createVirtualElement('section', {
			children: [
				'hey'
			]
		})
	}
}
