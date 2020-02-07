const classmates = []
const classmatesCommits = []
const search = document.getElementById('search').addEventListener('click', () => {
	fetchData(classmates)
})
async function fetchData(classmates) {
	await fetch(`https://api.github.com/repos/cmda-minor-web/web-app-from-scratch-1920/forks`)
		.then(response => {
			return response.json()
		})
		.then(jsonData => {
			jsonData.forEach(entry => {
				constructClassmateObjects(entry)
			})
		})
	const getcommits = async () => {
		await asyncForEach(classmates, async (entry) => {
			const {gitusername,repository} = entry
			await fetch(`https://api.github.com/repos/${gitusername}/${repository}/commits?author=${gitusername}`)
				.then(response => {
					return response.json()
				})
				.then(jsonData => {
					entry.commits = jsonData
					classmatesCommits.push(entry)
				})
		})
	}
	await getcommits()
	constructHtml(classmatesCommits)
}

function constructClassmateObjects(json) {
	const student = new Object()
	student.gitusername = json.owner.login
	student.repository = json.name
	classmates.push(student)
}

function constructHtml(classmatesCommits) {
	const htmlcontainer = document.querySelector('.student-commits')
	classmatesCommits.forEach(classmate => {
		classmate.commits.forEach(commit => {
		})
		console.log(classmate)
	})
	console.log(htmlcontainer)
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
    	await callback(array[index], index, array);
  	}
}
