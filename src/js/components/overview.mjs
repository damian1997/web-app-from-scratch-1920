import Component from './baseComponent.mjs'
import { createVirtualElement } from '../virtualdom/virtualdom.mjs'

export default class Overview extends Component {
	constructor(props) {
		super(props)
		this.props = props
		this.state = {
			list: [
				'first', 'second', 'third', 'fourth', 'fifth'
			]
		}

		this.timer = setInterval(_ => {
			this.setState({
				list: [...this.state.list, 'SoME More']
			})
		}, 1000)
	}
	createVirtualComponent(props,state) {
		return createVirtualElement('ul', {
			children: [
				...state.list.map(item => createVirtualElement('li', {children: [item]}))
			]
		})
	}
}
