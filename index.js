/* EXPRESS & MONGO */
const express = require('express')
const mongoose = require('mongoose')

const app = new express()
const dotenv = require('dotenv') // Using environment variables to protect MongoDB data from exposed
// const ejs = require('ejs') // !: Don't understand why

/* MIDDLEWARE */
const fileUpload = require('express-fileupload')
const validateMiddleware = require('./middleware/validateMiddleware')
const expressSession = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthencatedMiddleware')
const flash = require('connect-flash')

/* CONTROLLER */
const homeController = require('./controllers/home')
const newPostController = require('./controllers/newPost')
const getPostController = require('./controllers/getPost')
const storePostController = require('./controllers/storePost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

// Local database
// mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

// Test Mongo Atlas
// mongoose.connect('mongodb+srv://<user>:<password>@kakaofriends-diary.yppj6.mongodb.net/test', {
// 	useNewUrlParser: true,
// })

// Public Mongo Atlas
// mongoose.connect(
// 	'mongodb+srv://<user>:<password>@kakaofriends-diary.yppj6.mongodb.net/my_database',
// 	{
// 		useNewUrlParser: true,
// 	}
// )
// ==> DO NOT PUT IN THE INDEX.JS FILE BECAUSE IT WILL BE EXPOSED ON GITHUB

// Temp user, valid for 6 hours
// mongoose.connect('mongodb+srv://coder:Q9RoTBRXF1E4QfI6@kakaofriends-diary.yppj6.mongodb.net/test', {
// 	useNewUrlParser: true,
// })

dotenv.config()
const user = process.env.MONGO_USER
const pw = process.env.MONGO_PASS
mongoose.connect(
	'mongodb+srv://' + user + ':' + pw + '@kakaofriends-diary.yppj6.mongodb.net/test',
	{ useNewUrlParser: true }
)

app.set('view engine', 'ejs')

global.loggedIn = null

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())
app.use('/posts/store', validateMiddleware)
app.use(
	expressSession({
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true,
		// cookie: { secure: true },
	})
)
app.use(flash())
app.use('*', (req, res, next) => {
	loggedIn = req.session.userId
	next()
})

// Local host
// app.listen(4000, () => {
// 	console.log('App listening on port http://localhost:4000/')
// })

// Public on Heroku
let port = process.env.PORT
if (port == null || port == '') {
	port = 4000
}
app.listen(port, () => {
	console.log(`App listening on port: http://localhost:${port}`)
})

app.get('/', homeController)
app.get('/post/:id', getPostController)
app.get('/posts/new', authMiddleware, newPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)
app.use((req, res) => res.render('notfound'))
