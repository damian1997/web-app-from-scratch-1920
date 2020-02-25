/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 2 GUIDES:
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0
 *  */

import BaseComponent from './baseComponent.mjs'
import { renderComponent, createVirtualElement, updateComponent, renderElementToHTML } from '../virtualdom/virtualdom.mjs'

export default class Header extends BaseComponent {
	constructor(props) {
		super(props)
		this.submitSearchForm = this.submitSearchForm.bind(this)
		this.virtualElement = this.createVirtualComponent(this.props, this.state)
		this.base = renderElementToHTML(this.virtualElement)
	}

	submitSearchForm(event) {
		event.preventDefault();
		if(event.target[0].value != '') {
			this.props.getResults({search: event.target[0].value})
		} else {
			console.log('FILL IN A QUERY');
		}
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
									events: { submit: this.submitSearchForm },
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
