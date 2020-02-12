export async function cleanGithubData(forkersData) {
	const cleanedForkers = forkersData.map(async forker => {
		const cleanedForker = {}
		cleanedForker.gitusername = forker.gitusername
		cleanedForker.repository = forker.repository
		cleanedForker.commits = await cleanCommits(forker)
		//cleanedForker.issues = await cleanIssues(forker)
		return cleanedForker	
	})
	const promisedData = Promise.all(cleanedForkers)
	return promisedData
}

async function cleanCommits(forker) {
	const cleanedCommits = forker.commits.map(commitentry => {
		const { commit: { message, committer}, sha, html_url } = commitentry
		const splitDate = committer.date.split('T')
		const cleanedCommit = {}
		cleanedCommit.commit = message
		cleanedCommit.sha = sha
		cleanedCommit.url = html_url
		cleanedCommit.pushdate = splitDate[0]
		cleanedCommit.pushtime = splitDate[1].slice(0,-1)
		return cleanedCommit
	})
	return cleanedCommits
}

async function cleanIssues(forker) {
	const cleanedIssues = forker.issues.map(issueentry => {
		const { html_url, created_at, labels, title } = issueentry
		const cleanedIssue = {}
		cleanedIssue.url = html_url
		cleanedIssue.created_at = created_at
		cleanedIssue.labels = labels
		cleanedIssue.title = title
		return cleanedIssue
	})
	return  cleanedIssues
}

export async function sortCommits(forkers) {
	const forkersWithSortedCommits = forkers.map(forker => {
		const dates = [...new Set(forker.commits.map(commit => {
			return commit.pushdate
		}))]
		const sortedCommits = dates.map(date => {
			const dateObj = {}
			dateObj.date = date
			dateObj.commits = []
			forker.commits.forEach(commit => {
				if(date == commit.pushdate) {
					dateObj.commits.push(commit)
				}
			})
			return dateObj
		})
		forker.commits = sortedCommits
		return forker
	})
	const promisedData = Promise.all(forkersWithSortedCommits)
	return promisedData
}
