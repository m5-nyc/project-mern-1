'use strict'

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const config = require('../config/main');

function generateToken(user){
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // seconds
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
    };
}

//============================================
// Login Route
//============================================
exports.login = function(req, res, next){
    let userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
    });
}

//============================================
// Registration Route
//============================================
exports.register = function(req, res, next){
    // Check for registration erros
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = request.body.password;

    // return error if no email provided
    if(!email){
        return res.status(422).send({ error: 'You much enter an email address' });
    }

    // return error if full name not provided
    if(!firstName || !lastName){
        return res.status(422).send({ error: 'You much enter full name' });
    }

    // return error if no password provided
    if(!password){
        return res.status(422).send({ error: 'You much enter a password' });
    }

    User.findOne({ email: email }, function(err, existingUser){
        if(err){ return next(err); }

        // if user is not unique, return error
        if(existingUser){
            return res.status(422).send({ error: 'That email is already in use'});
        }

        // if email is unique and password was provided, create account
        let user = new User({
            email,
            password,
            profile: { firstName: firstName, lastName: lastName }
        });

        user.save(function(err, user){
            if(err){ return next(err); }

            // subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // respond with JWT if user was created

            let userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
}

//============================================
// Authorization Middleware
//============================================

// role authorization check
exports.roleAuthorization = function(role){
    return function(req, res, next){
        const user = req.user;

        User.findById(user._id, function(err, foundUser){
            if(err){
                res.status(422).json({ error: 'No user was found.'});
                return next(err);
            }

            // if user is found, check role
            if(foundUser.role == role){
                return next()
            }

            res.status(401).json({ error: 'You are not authorized to view this content.' })
            return next('Unauthorized');
        })
    }
}