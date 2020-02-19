import { updateComponent } from '../virtualdom/virtualdom.mjs'

export default class BaseComponent {
	constructor(props) {
		this.props = props
		this.state = {}
	}

	setState(state) {
		this.state = Object.assign({}, state)
		updateComponent(this)
	}
}
