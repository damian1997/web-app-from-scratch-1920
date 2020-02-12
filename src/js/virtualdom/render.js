const renderElem = ({ tagName, attrs, children}) => {
	// create the element
	//   e.g. <div></div>
	const $element = document.createElement(tagName);

	// add all attributs as specified in vNode.attrs
	//   e.g. <div id="app"></div>
	for (const [key, value] of Object.entries(attrs)) {
		$element.setAttribute(key, value);
	}

	// append all children as specified in vNode.children
	//   e.g. <div id="app"><img></div>
	if(children !== undefined) {
		for (const child of children) {
			$element.appendChild(render(child));
		}
	}

	return $element;
};

const render = (virtualNode) => {
	if (typeof virtualNode === 'string') {
		return document.createTextNode(virtualNode);
	}

	// we assume everything else to be a virtual element
	return renderElem(virtualNode);
};

export default render;
