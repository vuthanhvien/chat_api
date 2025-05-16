const express = require('express');
const ChatController = require('../controllers/chatController');

const router = express.Router();
const chatController = new ChatController();

function setChatRoutes(app) {
    router.post('/send-message', chatController.sendMessage.bind(chatController));
    router.get('/messages/:chatId', chatController.getMessages.bind(chatController));
    router.post('/create-group', chatController.createGroupChat.bind(chatController));

    app.use('/api/chat', router);
}

module.exports = setChatRoutes;