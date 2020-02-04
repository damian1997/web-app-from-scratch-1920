const classmates = []
const search = document.getElementById('search').addEventListener('click', () => {
	fetchData(classmates)
})
async function fetchData(classmates) {
	const classmatesCommits = []
	await fetch(`https://api.github.com/repos/cmda-minor-web/web-app-from-scratch-1920/forks`)
		.then(response => {
			return response.json()
		})
		.then(jsonData => {
			jsonData.forEach(entry => {
				constructClassmateObjects(entry)
			})
		})
	await classmates.forEach(classmate => {
		const {gitusername, repository} = classmate
		fetch(`https://api.github.com/repos/${gitusername}/${repository}/commits?author=${gitusername}`)
			.then(response => {
				return response.json()
			})
			.then(jsonData => {
				classmate.commits = jsonData
				classmatesCommits.push(classmate)
				console.log(classmatesCommits)
			})
	})
}

function constructClassmateObjects(json) {
	const student = new Object()
	student.gitusername = json.owner.login
	student.repository = json.name
	classmates.push(student)
}
