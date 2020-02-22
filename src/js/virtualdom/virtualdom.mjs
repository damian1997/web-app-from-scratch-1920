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
		const renderedComponent = component.createVirtualComponent(component.props, component.state)
		
		$element = renderElementToHTML(renderedComponent)
		
		// Save DOM reference in base field
		component.base = $element
		component.virtualElement = renderedComponent
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

export function updateComponent(component) {
	let virtualComponent = component.createVirtualComponent(component.props, component.state)
	component.base = diff(component.base, component.virtualElement, virtualComponent)
}

export function diff($element, virtualOldElement, virtualNewElement, parent) {
	if($element) {
		if(virtualNewElement === undefined) {
			return $element => {
				$element.remove()
				return undefined
			}
		}

		if(typeof virtualNewElement === 'string' || typeof virtualOldElement === 'string') {
			if(virtualOldElement !== virtualNewElement) {
				let $newNode = renderElementToHTML(virtualNewElement)
				$element.replaceWith($newNode)
				return $newNode
			} else return $element
		} 

		if(virtualOldElement.tagName !== virtualNewElement.tagName) {
			if(typeof virtualNewElement.tagName === 'function') {
				const component = new virtualNewElement.tagName(virtualNewElement.props)
				const virtualComponent = component.render(component.props, component.state)
				let $newNode = renderElementToHTML(virtualComponent)

				component.base = $newNode
				component.virtualOldElement = virtualComponent
				$element.replaceWith($newNode)
				return $newNode
			}

		}

		const patchAttributes = diffAttrs(virtualOldElement.attributes, virtualNewElement.attributes)
		const patchChildren = diffChildren(virtualOldElement.children, virtualNewElement.children)
		patchAttributes($element)
		patchChildren($element)

		virtualOldElement.children = virtualNewElement.children
		virtualOldElement.attributes = virtualNewElement.attributes

		return $element
	} else {
		const newDom = renderElementToHTML(virtualNewElement)
		parent.appendChild(newDom)
		return newDom 
	}
}

function zip(xs, ys) {
  const zipped = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

function diffAttrs(oldAttrs, newAttrs) {
	const patches = [];

	// setting new attributes
	for(const [key, value] of Object.entries(newAttrs)) {
		patches.push($node => {
			$node.setAttribute(key, value);
			return $node;
		});
	}

	// removing old attrs
	for (const key in oldAttrs){
		if(!(key in newAttrs)) {
			patches.push($node => {
				$node.removeAttribute(key);
				return $node;
			});
		}
	}

	return $node => {
		for(const patch of patches){
			patch($node);
		}
		return $node;
	};
}

function diffChildren(oldVirtualChildren, newVirtualChildren) {
	
	const childPatches = [];
	oldVirtualChildren.forEach((oldVirtualChild, i) => {
		childPatches.push(($node) => diff($node, oldVirtualChild, newVirtualChildren[i]));
	});

	const additionalPatches = [];
	for (const additionalVirtualChild of newVirtualChildren.slice(oldVirtualChildren.length)) {
		additionalPatches.push($node => {
			$node.appendChild(renderElementToHTML(additionalVirtualChild));
			return $node;
		});
	}

	return $parent => {
		for (const patch of additionalPatches){
			patch($parent);
		}

		for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
			patch($child);
		}

		return $parent;
	};
}
