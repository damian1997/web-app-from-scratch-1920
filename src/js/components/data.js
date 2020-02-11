export async function cleanGithubData(forkersData) {
	const cleanedForkers = forkersData.map(async forker => {
		const cleanedForker = {}
		cleanedForker.gitusername = forker.gitusername
		cleanedForker.repository = forker.repository
		cleanedForker.commits = await cleanCommits(forker)
		cleanedForker.issues = await cleanIssues(forker)
		return cleanedForker	
	})
	const promisedData = Promise.all(cleanedForkers)
	return promisedData
}

async function cleanCommits(forker) {
	const cleanedCommits = forker.commits.map(commitentry => {
		const { commit, sha, html_url } = commitentry
		const cleanedCommit = {}
		cleanedCommit.sha = sha
		cleanedCommit.url = html_url
		cleanedCommit.pushdate = commit.committer.date
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
