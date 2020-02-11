if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email)
)

app.get('/Home', (req, res) => {
    res.render('homepage.ejs')
})


const users = []    

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Tore'})
})


app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/Home',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register.ejs')
})
app.post('/register', async (req, res)  => {
    try {
        const hashedPasswords = await bcrypt.hash(req.body.password, 10) //Encrypts password
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPasswords
        })
        res.redirect('/Login')
    } catch {
        console.log('failed')
    }
    console.log(users)
 })

app.listen(3000)
