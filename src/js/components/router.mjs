import Component from './baseComponent.mjs'
import Routie from '../libraries/routie'
import App from '../app.mjs'
import Overview from './overview.mjs'
import Detail from './detail.mjs'
import Header from './header.mjs'

const render = ($element, parent) => {
	parent.appendChild($element)
}

const app = new App()

render(app.base, document.body)

Routie({
	'': () => app.changePage(Overview),
	'commit/:id': (id) => app.changePage(Detail, id)
})
