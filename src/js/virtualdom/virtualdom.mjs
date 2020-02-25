/* THIS CODE HAS BEEN WRITTEN BY FOLLOWING THESE 3 GUIDES:
 * https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-1-47b9b6fc6dfb
 * https://medium.com/@aibolkussain/create-your-own-virtual-dom-to-understand-it-part-2-c85c4ffd15f0
 *
 * Special thanks to Thijs for comming up with the sollution of handling events, check him out here:
 * https://github.com/iSirThijs
	* */

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
	// The virtual element is a string: return a text node
	if (typeof virtualElement === 'string')	return document.createTextNode(virtualElement);
	
	let {tagName, attributes, children, events} = virtualElement;
	let $element;
	if (typeof tagName === 'string') {
		// The tagname is a 'valid' HTML so using it to render
		$element = document.createElement(tagName);
		
		// set it's attribute
		for (const [key, value] of Object.entries(attributes)) {
			$element.setAttribute(key, value);
		}

		for (const [event, callback] of Object.entries(events)) {
			$element.addEventListener(event, callback);
		}

	} else if(typeof tagName === 'function') {
		const component = new tagName();
		const renderedComponent = component.createVirtualComponent(component.props, component.state);
		$element = renderElementToHTML(renderedComponent);
		
		component.base = $element;
		component.virtualElement = renderedComponent;
	}

	(children || []).forEach(child =>$element.appendChild(renderElementToHTML(child)));
	return $element;
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
		// There are no new elements so they can be removed	
		if(virtualNewElement === undefined) {
			$element.remove()
			return undefined
		}

		if(typeof virtualNewElement === 'string' || typeof virtualOldElement === 'string') {
			// Check if the string is same as old string
			if(virtualOldElement !== virtualNewElement) {
				let $newNode = renderElementToHTML(virtualNewElement)
				$element.replaceWith($newNode)
				return $newNode
			} else return $element
		}

		// Both elements are of a different type
		if(virtualOldElement.tagName !== virtualNewElement.tagName) {
			
			// element is a component
			if(typeof virtualNewElement.tagName === 'function') {
				const component = new virtualNewElement.tagName(virtualNewElement.props)
				const virtualComponent = component.createVirtualComponent(component.props, component.state)
				let $newNode = renderElementToHTML(virtualComponent)

				component.base = $newNode
				component.virtualOldElement = virtualComponent
				$element.replaceWith($newNode)
				return $newNode
			}
			
			// Replace old element with new element
			let $newNode = renderElementToHTML(virtualNewElement);
			$element.replaceWith($newNode);
			return $newNode;

		}
			
		// Check if attributes or children are different and patch them
		const patchAttributes = diffAttrs(virtualOldElement.attributes, virtualNewElement.attributes)
		const patchChildren = diffChildren(virtualOldElement.children, virtualNewElement.children)
		patchAttributes($element)
		patchChildren($element)

		virtualOldElement.children = virtualNewElement.children
		virtualOldElement.attributes = virtualNewElement.attributes

		return $element
	} else {
		// This is run when there is no DOM yet, this wil append the virtual dom to the parent
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

	for(const [key, value] of Object.entries(newAttrs)) {
		patches.push($node => {
			$node.setAttribute(key, value);
			return $node;
		});
	}

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
