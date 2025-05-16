class ChatController {
  constructor(chatModel, groupModel) {
    this.chatModel = chatModel;
    this.groupModel = groupModel;
  }

  async sendMessage(req, res) {
    try {
      const { senderId, receiverId, message, groupId } = req.body;
      const chatMessage = new this.chatModel({
        senderId,
        receiverId,
        message,
        groupId,
      });
      await chatMessage.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Message sent successfully",
          chatMessage,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error sending message", error });
    }
  }

  async getMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await this.chatModel
        .find({ chatId })
        .sort({ createdAt: 1 });
      res.status(200).json({ success: true, messages });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error fetching messages", error });
    }
  }

  async createGroupChat(req, res) {
    try {
      const { name, users } = req.body;
      const groupChat = new this.groupModel({ name, users });
      await groupChat.save();
      res
        .status(200)
        .json({
          success: true,
          message: "Group chat created successfully",
          groupChat,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error creating group chat", error });
    }
  }
}

module.exports =  ChatController;
