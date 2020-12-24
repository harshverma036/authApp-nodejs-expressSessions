const router = require('express').Router();
const { home, login, register, dashboard, verifyLogin, registerUser, logout } = require('../controller/user-controller');
const session = require('express-session');

// Middelwares
const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        res.redirect('/login');
    } else {
        next();
    }
}

const redirectDashboard = (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

// app routes
router.get('/', redirectDashboard, home);
router.get('/login', redirectDashboard, login);
router.get('/register', redirectDashboard, register);
router.get('/dashboard', redirectLogin, dashboard);
router.post('/verifylogin', verifyLogin);
router.post('/registeruser', registerUser);
router.post('/logout', logout)

module.exports = router;