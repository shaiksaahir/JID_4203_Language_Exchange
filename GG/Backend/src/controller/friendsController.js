import FriendsModel from'../models/FriendsModel';
import friendsService from'../Service/friendsService';
let createFriends = async (req, res) => {
    let user1_ID = req.body.user1_ID;
    let user2_ID = req.body.user2_ID;
    let message = await friendsService.handleFriendsModel(user1_ID, user2_ID)
     return res.status(200).json({
             message: message.errMessage,
             messageData: message.data? message.data : {}
     })
}

let findFriends = async (req, res) => {
    //let user1_ID = req.params.user1_ID
    console.log("iddd" + req.body.id)
    let user1_ID = req.body.id
    console.log("check friends for userID >>>>", user1_ID)
    let messageData = await friendsService.handleFindFriends(user1_ID)
    console.log(messageData.data)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}

let findFriend = async (req, res) => {
    let user1_ID = req.params.user1_ID
    let user2_ID = req.params.user2_ID

    console.log("check if two users are friends >>>>", user1_ID, user2_ID)
    let messageData = await friendsService.handleFindFriend(user1_ID, user2_ID)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}


module.exports = {
    createFriends: createFriends,
    findFriends: findFriends,
    findFriend: findFriend
}