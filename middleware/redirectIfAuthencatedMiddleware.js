module.exports = (req, res, next) => {
	// if user logged in, redirect to home page
	if (req.session.userId) return res.redirect('/')
	next()
}
