const session = require('express-session');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');

module.exports.home = (req, res) => {
    res.render('index');
}

module.exports.login = (req, res) => {
    res.render('login');
}

module.exports.verifyLogin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Please enter username or password..')
    } else {
        User.findOne({ username: email })
            .then(founduser => {
                bcrypt.compare(password, founduser.password, (error, result) => {
                    if (result === true) {
                        req.session.userID = founduser._id;
                        res.redirect('/dashboard');
                    }
                })
            })
            .catch(err => console.log(err))
    }
}

module.exports.registerUser = (req, res) => {
    const { fullname, email, password, confirmpassword } = req.body;
    if (!fullname || !email || !password, !confirmpassword) {
        res.send('please insert the valid values to register');
    } else {
        if (password === confirmpassword) {
            bcrypt.hash(password, 10, (err, passwordHash) => {
                if (err) {
                    throw err;
                } else {
                    User.find({ username: email })
                        .then(data => {
                            if (data.length > 0) {
                                console.log('user already exists');
                                res.redirect('/');
                            } else {
                                const newUser = new User({
                                    fullName: fullname,
                                    username: email,
                                    password: passwordHash
                                });
                                newUser.save()
                                    .then(() => {
                                        console.log('User sucessfully created....')
                                        res.redirect('/login');
                                    }
                                    )
                                    .catch(err => console.log(`Something went wrong, Error: ${err}`))
                            }
                        })
                        .catch(error => console.log(error))

                }
            });
        } else {
            console.log('Password do not matched..!!');
        }

    }
}

module.exports.register = (req, res) => {
    res.render('register');
}

module.exports.dashboard = (req, res) => {
    User.findById(req.session.userID)
        .then(data => {
            console.log(data)
            res.render('dashboard', {
                uname: data.username,
                fname: data.fullName
            });
        })
        .catch(err => console.log(err))
}

module.exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.redirect('/dashboard');
        } else {
            res.clearCookie('sid');
            res.redirect('/');
        }
    });
}