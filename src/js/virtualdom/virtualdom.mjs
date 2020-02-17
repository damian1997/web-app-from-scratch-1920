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

export function createVirtualElement( tagName, { attributes = {}, children = [] } = {} ) {
	const virtualElement = Object.create(null)

	Object.assign(virtualElement, {
		tagName,
		attributes,
		children,
	})

	return virtualElement
}

export function renderElementToHTML(virtualElement) {
	let $element

	const { tagName, attributes, children } = virtualElement

	if(typeof virtualElement === 'string') return document.createTextNode(virtualElement)
	
	if(typeof tagName === 'string') {
		$element = document.createElement(tagName)

		for(let key in attributes) {
			$element.setAttribute(key, attributes[key])
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

export function renderComponent(component, parent) {
	const oldBase = component.base
	console.log(component);
	component.base= renderElementToHTML(
		component.createVirtualComponent(component.props, component.state)
	)

	if(parent) {
		parent.appendChild(component.base)
	} else {
		oldBase.parentNode.replaceChild(component.base, oldBase)
	}
}
