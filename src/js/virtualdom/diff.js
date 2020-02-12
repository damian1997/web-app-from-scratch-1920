import render from './render'

const zip = (xs, ys) => {
  const zipped = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

const diffAttrs = (oldAttrs, newAttrs) => {
	const patches = []

	// Setting newAttributes
	for(const [key,value] of Object.entries(newAttrs)) {
		patches.push($node => {
			$node.setAttribute(key,value)
			return $node
		})
	}

	// Remove not needed old attributes
	for(const key in oldAttrs) {
		if(!(key in newAttrs)) {
			patches.push($node => {
				$node.removeAttribute(key)
				return $node
			})
		}
	}

	return $node => {
		for(const patch of patches) {
			patch($node)
		}
		return $node
	}
}

const diffChildren = (oldVirtualChildren, newVirtualChildren) => {
	const childPatches = []
	oldVirtualChildren.forEach((oldVirtualChildren, i) => {
		childPatches.push(diff(oldVirtualChildren, newVirtualChildren[i]))
	})
	
	const additionalPatches = []
	for(const additionalVirtualChild of newVirtualChildren.slice(oldVirtualChildren.length)) {
		additionalPatches.push($node => {
			$node.appendchild(render(newVirtualChildren))
			return $node
		})
	}

	return $parent => {
		for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
			patch($child)

		}

		for (const patch of additionalPatches) {
			patch($parent);
		}
		return $parent;
	}
}

let diff = (oldVirtualTree, newVirtualTree) => {
	if(newVirtualTree === undefined) {
		return $node => {
			$node.remove()
			return undefined
		}
	}

	if(typeof oldVirtualTree === 'string' || typeof newVirtualTree === 'string') {
		if(oldVirtualTree !== newVirtualTree) {
			return $node => {
				const $newNode = render(newVirtualTree)
				$node.replaceWith($newNode)
				return $newNode
			}
		} else {
			return $node => $node
		}
	}

	if(oldVirtualTree.tagName !== newVirtualTree.tagName) {
		return $node => {
			const $newNode = render(newVirtualTree)
			$node.replaceWith($newNode)
			return $newNode
		}
	}

	const patchAttrs = diffAttrs(oldVirtualTree.attrs, newVirtualTree.attrs)
	const patchChildren = diffChildren(oldVirtualTree.children, newVirtualTree.children)

	return $node => {
		patchAttrs($node)
		patchChildren($node)
		return $node
	}
}

export default diff
