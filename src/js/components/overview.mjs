/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 2 GUIDES:
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0
 *  */

//import UniversalRouter from 'universal-router'
import BaseComponent from './baseComponent.mjs'
import overviewCard from './overviewcard.mjs'

import { renderComponent, createVirtualElement, updateComponent } from '../virtualdom/virtualdom.mjs'

export default class Overview extends BaseComponent {
	constructor(props) {
		super(props)
		this.state.results = [
		]
		this.overviewCard = new overviewCard()
	}


	createVirtualComponent(props,state) {
		return createVirtualElement('section', {
			attributes: {
				class: 'forker-overview'
			},
			children: [
				...state.results.map((item) => {
					return this.overviewCard.createVirtualComponent(item, this.state)
				})
			]
		})
	}
}
