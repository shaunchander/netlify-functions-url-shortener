const urlForm = document.getElementById('urlShortenForm')
const URL = document.getElementById('url')
const URLTable = document.getElementById('urlTable')
// Check if the URL is valid or if one was even submitted

urlForm.addEventListener('submit', async e => {
	const url = URL.value
	e.preventDefault()

	if (!url) return alert('Please enter a URL.')

	// Got this straight from Stack Overflow: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/49849482
	function validURL(str) {
		var pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		) // fragment locator
		return !!pattern.test(str)
	}
	if (!validURL(url)) return alert('Please enter a valid URL.')

	try {
		const result = await fetch(
			'http://localhost:8888/.netlify/functions/shorten-url',
			{
				method: 'POST',
				body: JSON.stringify({ url }),
			}
		)
		if (!result.ok) throw new Error('Something went wrong')

		window.location.reload()
	} catch (err) {
		alert(err.message)
	}
})

const getURLS = async () => {
	let result = await fetch(
		'http://localhost:8888/.netlify/functions/shorten-url'
	)
	result = await result.json()

	console.log(result)

	result.forEach(url => {
		URLTable.insertAdjacentHTML(
			'afterBegin',
			`
        <tr>
						<td class="px-4 py-2">${url.url}</td>
						<td class="px-4 py-2">${url.hits}</td>
						<td class="px-4 py-2">${window.location.origin}/${url.shortURL}</td>
						<td class="px-4 py-2">
							<button
								class="bg-red-400 rounded text-white w-8 h-8 block hover:bg-red-500" onclick="deleteURL('${url.shortURL}')"
							>
								&times;
							</button>
						</td>
					</tr>
        `
		)
	})
}

getURLS()

const deleteURL = async urlID => {
	const result = await fetch(
		'http://localhost:8888/.netlify/functions/shorten-url',
		{
			method: 'DELETE',
			body: JSON.stringify({ urlID }),
		}
	)

	if (!result.ok) return alert('Something went wrong')

	window.location.reload()
}
