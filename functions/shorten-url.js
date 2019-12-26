require('dotenv/config')
const querystring = require('querystring')
const mongoose = require('mongoose')
const URL = require('./models/URL')

exports.handler = async (event, context) => {
	await mongoose.connect(process.env.MONGOOSE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

	if (event.httpMethod === 'POST') {
		try {
			const { url } = JSON.parse(event.body)
			const newURL = new URL()
			newURL.url = url
			await newURL.save()
			return {
				statusCode: 200,
				body: '',
			}
		} catch (err) {
			return { statusCode: 400, body: JSON.stringify({ error: err.message }) }
		}
	}

	if (event.httpMethod === 'GET') {
		try {
			const data = await URL.find({})
			console.log(data)
			return {
				statusCode: 200,
				body: JSON.stringify(data),
			}
		} catch (err) {
			return { statusCode: 200, body: JSON.stringify({ error: err.message }) }
		}
	}

	if (event.httpMethod === 'DELETE') {
		try {
			const { urlID } = JSON.parse(event.body)
			await URL.findOneAndDelete({ shortURL: urlID })
			return {
				statusCode: 200,
				body: 'Successfully deleted',
			}
		} catch (err) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: err.message }),
			}
		}
	}

	return {
		statusCode: 400,
		body: JSON.stringify({ error: 'HTTP Method Invalid' }),
	}
}
