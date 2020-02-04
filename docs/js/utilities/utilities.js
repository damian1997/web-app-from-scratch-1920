const checkStatus = response => {
	if(response.ok) {
		return respone;
	} else {
		const error = new Error(response.statusText)
		error.response = response
		throw error
	}
}

const parseJson = res => res.json()

const Fetcher = {
	get: (path, params) =>
	fetch(path, params)
	.then(checkStatus)
	.then(parseJson),
	post: ''
}

export { Fetcher }
