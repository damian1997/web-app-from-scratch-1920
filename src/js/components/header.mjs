import BaseComponent from './baseComponent.mjs'
import { createVirtualElement } from '../virtualdom/virtualdom.mjs'

export default class Header extends BaseComponent {
	constructor(props) {
		super(props)
		this.props = props
	}

	createVirtualComponent(props,state) {
		return createVirtualElement('header', {
			children: [
				createVirtualElement('div', {
					children: [
						createVirtualElement('section', {
							children: [
								createVirtualElement('h1', {children:['Has anyone been working on my forked repo recently?']}),
								createVirtualElement('form', {
									children: [
										createVirtualElement('input', {
											attributes: {type: 'search', placeholder: 'repository'}
										}),
										createVirtualElement('button', {
											attributes: {type: 'submit'},
											children: ['Search repository']
										})
									]
								})
							]
						})

					]
				})
			]
		})
	}
}
