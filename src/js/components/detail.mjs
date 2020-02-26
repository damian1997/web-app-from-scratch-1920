import Component from './baseComponent.mjs'
import { createVirtualElement, renderElementToHTML, renderComponent, diff, updateComponent } from '../virtualdom/virtualdom.mjs'

export default class Detail extends Component {
	constructor(props) {
		super(props)
		this.toggleCard = this.toggleCard
	}

	toggleCard(event) {
		const codeContainer = this.nextSibling
		if(codeContainer.classList.contains('hide')) {
			codeContainer.classList.add('show')
			codeContainer.classList.remove('hide')
		} else {
			codeContainer.classList.add('hide')
			codeContainer.classList.remove('show')
		}
	}

	createVirtualComponent(props, state) {
		console.log(state.detailresults[0])
		if(state.detailresults.length) {
			return createVirtualElement('section', {
				attributes: { class: 'detail' },
				children: [
					...state.detailresults[0].map((item) => {
						if(item.imagePath) {
							return createVirtualElement('section', {
								attributes: { class: 'detail--imagesection' },
								children: [
									createVirtualElement('header', {
										events: { click: this.toggleCard },
										children: [
											createVirtualElement('h3', {
												children: [ item.filename.toString() ]
											})
										]
									}),
									createVirtualElement('div', {
										attributes: { class: 'image-container hide' },
										children: [
											createVirtualElement('img', {
												attributes: { src: `${item.imagePath.toString()}` }
											})
										]
									})
								]
							})
						} else {
							return createVirtualElement('section', {
								attributes: { class: 'detail--codesection' },
								children: [
									createVirtualElement('header', {
										events: { click: this.toggleCard },
										children: [
											createVirtualElement('h3', {
												children: [ item.filename.toString() ]
											})
										]
									}),
									createVirtualElement('table', {
										attributes: { class: 'hide' },
										children: [
											createVirtualElement('tbody', {
												children: [
													...item.filecontents.map((codeline) => {
														return createVirtualElement('tr', {
															children: [
																createVirtualElement('td', {
																	children: [
																		createVirtualElement('span', {
																			children: [codeline.toString()]
																		})
																	]
																})
															]
														})
													})
												]
											})
										]
									})
								]
							})
						}
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
