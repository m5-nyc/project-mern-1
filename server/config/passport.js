const passport = require('passport');
const User = require('../models/user');
const config = require('./main');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = rquire(passport-jwt).ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

// from passport doc
// setting up the local login strategy
const loginLogin = new LocalStrategy(localOptions, function(email, password, done){
    User.findOne({ email: email }, function(err, user){
        if(err) {return done(err); }
        if(!user) { return done(null, false, { error: 'Your login details could not be verified'}); }

        user.comparePassword(password, function(err, isMatch){
            if(err) { return done(err); }
            if(!isMatch) { return done(null, false, { error: 'Your login details could not be verified'}); }

            return done(null, user);
        });
    });
});

const jwtOptions = {
    // telling Passport to check authorization headers for JWT
    jwtFormRequest: ExtractJwt.fromAuthHeader(),
    // telling passport where to find the secret
    secretOrKey: config.secret
};

// setting up the JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    User.findById(payload._id, function(err, user){
        if(err) { return done(err, false); }

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);