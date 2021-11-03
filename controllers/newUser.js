module.exports = (req, res) => {
	let username = ''
	let password = ''
	const data = req.flash('data')[0]

	if (typeof data != 'undefined') {
		username = data.username
		password = data.password
	}

	res.render('register', {
		// errors: req.session.validationErrors,
		errors: req.flash('validationErrors'),
		username: username,
		password: password,
	}) //render resgister.ejs
}
