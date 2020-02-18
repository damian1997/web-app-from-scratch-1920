/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 3 GUIDES:
 * https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0
 *
 * Special thanks to Thijs for comming up with the sollution of handling events, check him out here:
 * https://github.com/iSirThijs
	* */

export function hyperscript(nodeName, attributes, ...children) {
	const $el = document.createElement(nodeName)

	for(let key in attributes) {
		$el.setAttribute(key, attributes[key])
	}

	children.forEach(child => {
		if(typeof child === 'string') {
			$el.appendChild(document.createTextNode(child))
		} else {
			$el.appendChild(child)
		}
	})

	return $el
}

export function createVirtualElement( tagName, { attributes = {}, children = [], events = {} } = {} ) {
	const virtualElement = Object.create(null)

	Object.assign(virtualElement, {
		tagName,
		attributes,
		children,
		events
	})

	return virtualElement
}

export function renderElementToHTML(virtualElement) {
	let $element

	const { tagName, attributes, children, events } = virtualElement

	if(typeof virtualElement === 'string') return document.createTextNode(virtualElement)
	
	if(typeof tagName === 'string') {
		$element = document.createElement(tagName)

		for(let key in attributes) {
			$element.setAttribute(key, attributes[key])
		}
		
		// Add event + callback to the element 
		for(const [event, callback] of Object.entries(events)) {
			$element.addEventListener(event, callback)
		}
	} else if(typeof tagName === 'function') {
		// Initiate the component
		const component = new tagName(attributes)
		$element = renderElementToHTML(
		component.createVirtualComponent(component.props, component.state)
		)
		
		// Save DOM reference in base field
		component.base = $element
	}
	
	// Recursively render this for all its children
	(children || []).forEach(child => $element.appendChild(renderElementToHTML(child)))

	return $element
}

export function renderComponent({ createVirtualComponent, base, props = {}, state = {} }, parent) {
	const oldBase = base
	base= renderElementToHTML(
		createVirtualComponent(props, state)
	)
	if(parent) {
		parent.appendChild(base)
	} else {
		oldBase.parentNode.replaceChild(base, oldBase)
	}
}
