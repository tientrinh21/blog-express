/* EXPRESS & MONGO */
const express = require('express')
const mongoose = require('mongoose')

const app = new express()
const ejs = require('ejs') // !: Don't understand why

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

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

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

app.listen(4000, () => {
	console.log('App listening on port http://localhost:4000/')
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
