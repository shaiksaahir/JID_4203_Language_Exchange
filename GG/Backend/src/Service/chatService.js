import db from '../models/index';
const { Op } = require("sequelize");

let handleChatModel = (senderId, receiverId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let message = {};
            console.log("Check chatService");

            let chatModel = await db.ChatModel.create({
                senderId: senderId,
                receiverId: receiverId
            });
            message.errMessage = 'Chat Successfully Created!';
            message.data = chatModel;
            resolve(message);
        }catch(e){
            reject(e)
        }
    })
}


let handleFindChats = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let messageData = {};

            let chatModels = await db.ChatModel.findAll({
                    where: {[Op.or]: [{senderId : userId}, {receiverId : userId}]
                    }
            });
            messageData.errMessage = 'Chats found!';
            messageData.data = chatModels;
            resolve(messageData);
            }

        catch(e){
            reject(e)
        }
    })
}

let handleFindChat = (senderId, receiverId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let messageData = {};

            let chatModels = await db.ChatModel.findAll({
                    where: {
                        [Op.and]: [
                          { senderId: senderId },
                          { receiverId: receiverId }
                        ]
                    }
            });
            console.log(chatModels)
            messageData.errMessage = 'Find chats of a specific sender & receiver';
            messageData.data = chatModels;
            resolve(messageData);
            }

        catch(e){
            reject(e)
        }
    })
}




module.exports = {handleChatModel : handleChatModel,
 handleFindChats : handleFindChats,
 handleFindChat : handleFindChat}