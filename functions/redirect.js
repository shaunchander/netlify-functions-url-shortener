const mongoose = require('mongoose')
const URL = require('./models/URL')

exports.handler = async (event, context) => {
	const path = event.path.replace(/\/\.netlify\/functions\/[^/]*\//, '')

	try {
		await mongoose.connect(process.env.MONGOOSE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		const shortenedURL = await URL.findOneAndUpdate(
			{ shortURL: path },
			{ $inc: { hits: 1 } }
		)
		console.log('Successful redirect to ' + shortenedURL.url)

		return {
			statusCode: 302,
			headers: {
				Location: shortenedURL.url,
				'Cache-Control': 'no-cache',
			},
			body: '',
		}
	} catch (err) {
		return {
			statusCode: 400,
			body: JSON.stringify({ err: err.message }),
		}
	}
}
