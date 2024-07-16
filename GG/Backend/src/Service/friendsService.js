import db from '../models/index';
const { Op } = require("sequelize");

let handleFriendsModel = (user1_ID, user2_ID) => {
    return new Promise(async (resolve, reject) => {
        try{
            let message = {};
            console.log("Check friendsService");

            let friendsModel = await db.FriendsModel.create({
                user1_ID: user1_ID,
                user2_ID: user2_ID
            });
            message.errMessage = 'Friends Model Successfully Created!';
            message.data = friendsModel;
            resolve(message);
        }catch(e){
            reject(e)
        }
    })
}


let handleFindFriends = (user1_ID) => {
    return new Promise(async (resolve, reject) => {
        try{
            let friendsData = {};

            let friendsModels = await db.FriendsModel.findAll({
                    where: {user1_ID : user1_ID},
                    attributes: ['user2_ID']
            });
            console.log("friends"+ friendsModels)
            friendsData.errMessage = 'Friends found!';
            friendsData.data = friendsModels;
            resolve(friendsData);
            }

        catch(e){
            reject(e)
        }
    })
}

let handleFindFriend = (user1_ID, user2_ID) => {
    return new Promise(async (resolve, reject) => {
        try{
            let messageData = {};

            let friendsModels = await db.FriendsModel.findAll({
                    where: {
                        [Op.and]: [
                          { user1_ID: user1_ID },
                          { user2_ID: user2_ID }
                        ]
                    }
            });
            console.log(friendsModels)
            messageData.errMessage = 'Find friends of a specific sender & receiver';
            messageData.data = friendsModels;
            resolve(messageData);
            }

        catch(e){
            reject(e)
        }
    })
}




module.exports = {handleFriendsModel : handleFriendsModel,
 handleFindFriends : handleFindFriends,
 handleFindFriend : handleFindFriend}