const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

// BlogPost.create(
// 	{
// 		title: 'The Mythbuster’s Guide to Saving Money on Energy Bills',
// 		body: 'If you have been here a long time, you might remember when I went on ITV Tonight to dispense a masterclass in saving money on energy bills. Energy-saving is one of my favourite money topics…',
// 	},
// 	(error, blogpost) => {
// 		console.log(error, blogpost)
// 	}
// )

var id = '614a15f4dfb041aeae18e495'
BlogPost.findById(id, (error, blogspot) => {
	console.log(error, blogspot)
})
