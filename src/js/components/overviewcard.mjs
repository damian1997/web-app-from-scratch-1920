import BaseComponent from './baseComponent.mjs'
import { renderComponent, createVirtualElement, updateComponent } from '../virtualdom/virtualdom.mjs'

export default class overviewCard extends BaseComponent {
	constructor(props) {
		super(props)
		this.state = {}
		this.toggleOverviewCards = this.toggleOverviewCards
	}

	toggleOverviewCards(event) {
		const commitsContainer = this.nextSibling
		if(commitsContainer.classList.contains('hide')) {
			commitsContainer.classList.add('show')
			commitsContainer.classList.remove('hide')
		} else {
			commitsContainer.classList.add('hide')
			commitsContainer.classList.remove('show')
		}
	}

	createVirtualComponent(props,state) {
		return createVirtualElement('section', {
			attributes: { class: 'forker-overview--card' },
			children: [
				createVirtualElement('header', {
					events: { click: this.toggleOverviewCards },
					children: [
						createVirtualElement('h2', {
							children: [props.gitusername]
						}),
						createVirtualElement('div', {
							children: [
								createVirtualElement('span', {
									children: [props.commits.length.toString()]
								}),
								createVirtualElement('span', {
									attributes: { class: 'icon-down-dir' }
								})
							]
						})
					]
				}),
				createVirtualElement('div', {
					attributes: { class: 'forker-overview--card--commits-container hide' },
					children: [
						...props.commits.map((commitbydate) => {
							return createVirtualElement('section', {
								children: [
									createVirtualElement('h3', {
										children: [
											commitbydate.date.toString(),
										]
									}),
									...commitbydate.commits.map((commit) => {
										return createVirtualElement('div', {
											children: [
												createVirtualElement('a', {
													events: { click: this.detailState },
													attributes: {href: `#commit/${props.gitusername.toString()}&${props.repository.toString()}&${commit.sha.toString()}`},
													children: [
														commit.commit.toString()
													]
												})
											]
										})
									})
								]
							})
						})
					]
				}),
			]
		})
	}
}
