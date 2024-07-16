import ChatModel from'../models/ChatModel';
import chatService from'../Service/chatService';
let createChat = async (req, res) => {
    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;
    let message = await chatService.handleChatModel(senderId, receiverId)
     return res.status(200).json({
             message: message.errMessage,
             messageData: message.data? message.data : {}
     })
}

let findChats = async (req, res) => {
    let userId = req.params.userId
    let messageData = await chatService.handleFindChats(userId)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}

let findChat = async (req, res) => {
    let senderId = req.params.senderId
    let receiverId = req.params.receiverId
    let messageData = await chatService.handleFindChat(senderId, receiverId)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}


module.exports = {
    createChat: createChat,
    findChats: findChats,
    findChat: findChat
}