import BaseComponent from './baseComponent.mjs'
import { renderComponent, createVirtualElement, updateComponent } from '../virtualdom/virtualdom.mjs'

export default class overviewCard extends BaseComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	createVirtualComponent(props,sate) {
		console.log(props)

		return createVirtualElement('section', {
			attributes: {
				class: 'forker-overview--card'
			},
			children: [
				createVirtualElement('header', {
					children: [
						createVirtualElement('h2', {
							children: [props.gitusername]
						}),
						createVirtualElement('span', {
							children: [props.commits.length.toString()]
						})
					]
				}),
				...props.commits.map((commitbydate) => {
					return createVirtualElement('section', {
						children: [
							commitbydate.date.toString(),
							...commitbydate.commits.map((commit) => {
								return createVirtualElement('div', {
									children: [commit.commit.toString()]
								})
							})
						]
					})
				})
			]
		})
	}
}
