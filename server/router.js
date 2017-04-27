const AuthenticationController = require('./controllers/authentication');
// const UserController = require('./controllers/user');
const ChatController = require('./controllers/chat');
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
    const chatRoutes = express.Router();

    //==================================
    // Auth Routes
    //==================================

    // set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // resigstration route
    authRoutes.post('/register', AuthenticationController.register);

    // login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    //==================================
    // Chat Routes
    //==================================

    // set chat routes as a subgroup to apiRoutes
    apiRoutes.use('/chat', chatRoutes);

    // view messages to and from authenticated user
    chatRoutes.get('/', requireAuth, ChatController.getConversations);

    // retrieve single conversation
    chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

    // send reply in conversation
    chatRoutes.post('/:conversationId, requireAuth, ChatController.sendReply');

    // Start new conversation
    chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

    // set url for API group routes
    app.use('/api', apiRoutes);
};