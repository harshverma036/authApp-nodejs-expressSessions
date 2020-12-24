const express = require('express');
const bodyParser = require('body-parser');
const router = require('./app/routes/app-routes');
const Port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const config = require('config');
const session = require('express-session');

const app = express();

// dbconnection
mongoose.connect(config.get('url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(res => console.log('Database connected....'))
    .catch(err => console.log(`Error Occured:- ${err}`))

// session
const MAX_AGE = 1000 * 60 * 60 * 60 * 10;
app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'thisissecretofauthapp',
    cookie: {
        maxAge: MAX_AGE,
        sameSite: true
    }
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.listen(Port, () => console.log(`http://localhost:${Port}`));