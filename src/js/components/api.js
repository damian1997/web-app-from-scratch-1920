export async function getForkers(baseUrl,forkedRepoOwner,forkedRepo) {
	const data = await fetch(`${baseUrl}/${forkedRepoOwner}/${forkedRepo}/forks`)
		.then(res => {
			return res.json()
		})
		.then(jsonData => {
			const constructedEntries = jsonData.map(entry => {
				return constructForkerObject(entry)
			})
			return constructedEntries
		})
		.catch(err => {
			console.log('Error ', err)
		})
	const promisedData = await Promise.all(data)
	console.log(JSON.stringify(promisedData));
	return promisedData
}

export async function getCommits(baseUrl,users) {
	const usersWithCommits = users.map(user => {
		const { gitusername, repository } = user
		const userWithCommits = fetch(`${baseUrl}/${gitusername}/${repository}/commits?author=${gitusername}`)
			.then(res => {
				return res.json()
			})
			.then(jsonData => {
				user.commits = jsonData
				return user
			})
			.catch(err => {
				console.log('Error ', err)
			})
		return userWithCommits
	})
	const promisedData = Promise.all(usersWithCommits)
	return promisedData
}

export async function getIssues(baseUrl, users) {
	const usersWithIssues = users.map(user=> {
		const { gitusername, repository } = user
		const userWithIssues = fetch(`${baseUrl}/${gitusername}/${repository}/issues`)
			.then(res => {
				return res.json()
			})
			.then(jsonData => {
				user.issues = jsonData
				return user
			})
			.catch(err => {
				console.log('Error ', err)
			})
		return userWithIssues
	})
	const promisedData = Promise.all(usersWithIssues)
	return promisedData
}

async function constructForkerObject(entry) {
	const forker = new Object()
	forker.gitusername = entry.owner.login
	forker.repository = entry.name
	return forker
}
