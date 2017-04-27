const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema defines how to chat messages will be stored in MongoDB
const ConversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User '}],
});

module.exports = mongoose.model('Conversation', ConversationSchema);
