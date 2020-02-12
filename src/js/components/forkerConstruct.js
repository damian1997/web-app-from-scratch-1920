import createElement from '../virtualdom/createElement'

export default (forker) => {
	return createElement('section', {
		attrs: {
			class: 'forker__overview__entry'
		},
		children: [
			createElement('h2', {
				attrs: {
					class: 'title'
				},
				children: [
					forker.gitusername
				]
			}),
		]
	})
}

