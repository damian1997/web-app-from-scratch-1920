import BaseComponent from './baseComponent.mjs'
import { renderComponent, createVirtualElement } from '../virtualdom/virtualdom.mjs'

export default class Overview extends BaseComponent {
	constructor(props) {
		super(props)
		this.props = props
	}
	
	setForkers(forkers) {
		this.state.forkers = forkers
		renderComponent(this)
	}

	createVirtualComponent(props,state) {
		return createVirtualElement('ul', {
		})
	}
}
