import db from '../models/index';

let handleMessageModel = (chatId, senderId, text) => {
     return new Promise(async (resolve, reject) => {
            try{
                let message = {};
                let messageModel = await db.MessageModel.create({
                    chatId: chatId,
                    senderId: senderId,
                    text: text,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                message.errMessage = 'Successfully Added!';
                message.data = messageModel;
                resolve(message);
            }catch(e){
                reject(e)
            }
        })
}

let handleFindMessage = (chatId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let messageData = {};
            let messageModel = await db.MessageModel.findOne({
                    where: {chatId: chatId}
            });
            messageData.errMessage = 'Find message from a sender';
            messageData.data = messageModel;
            resolve(messageData);
            }

        catch(e){
            reject(e)
        }
    })
}

let handleFindMessages = (chatId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let messageData = {};
            let messageModel = await db.MessageModel.findAll({
                    where: {chatId: chatId}
            });
            messageData.errMessage = 'Find message from a sender';
            messageData.data = messageModel;
            resolve(messageData);
            }

        catch(e){
            reject(e)
        }
    })
}


module.exports = {handleMessageModel, handleFindMessage, handleFindMessages}