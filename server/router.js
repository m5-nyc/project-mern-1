const AuthenticationController = require('./controllers/authentication');
const express = require('express');
const passportService = require('./config/passport');
const passport = require('passport');

// middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', { session: false });

// role base authorization
const REQUIRE_ADMIN = "Admin";
const REQUIRE_OWNER = "Owner";
const REQUIRE_CLIENT = "Client";
const REQUIRE_MEMBER = "Member";

module.exports = function(app){
    // initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    //==================================
    // Auth Routes
    //==================================

    // set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // resigstration route
    authRoutes.post('/register', AuthenticationController.register);

    // login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    // set url for API group routes
    app.use('/api', apiRoutes);
};