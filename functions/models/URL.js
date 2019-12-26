const mongoose = require('mongoose')
const shortid = require('shortid')

const URLSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true,
	},
	hits: {
		type: Number,
		default: 0,
		required: true,
	},
	shortURL: {
		type: String,
		default: shortid.generate,
		required: true,
	},
})

const URLModel = mongoose.model('URL', URLSchema)

module.exports = URLModel
