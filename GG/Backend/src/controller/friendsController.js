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


// TOWNSHEND: several of these console.logs were in infinite loops; didn't have time to trace them down so I commented them out.
// that's the only update to this file
let findFriends = async (req, res) => {
    //let user1_ID = req.params.user1_ID
    //console.log("iddd" + req.body.id)
    let user1_ID = req.body.id
    //console.log("check friends for userID >>>>", user1_ID)
    let messageData = await friendsService.handleFindFriends(user1_ID)
    //console.log(messageData.data)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}

let findFriend = async (req, res) => {
    let user1_ID = req.params.user1_ID
    let user2_ID = req.params.user2_ID

    //console.log("check if two users are friends >>>>", user1_ID, user2_ID)
    let messageData = await friendsService.handleFindFriend(user1_ID, user2_ID)
    return res.status(200).json({
        message: messageData.errMessage,
        chatsData: messageData.data? messageData.data : {}
    })
}
let addFriend = async (req, res) => {
    const { user_id_1, user_1_first_name, user_1_last_name, user_id_2, user_2_first_name, user_2_last_name } = req.body;
    console.log("Received addFriend request with data:", req.body);
    try {
        const response = await friendsService.createFriend(
            user_id_1,
            user_1_first_name,
            user_1_last_name,
            user_id_2,
            user_2_first_name,
            user_2_last_name
        );
        res.status(200).json({ message: 'Friend added successfully', data: response });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Error adding friend', error });
    }
};

module.exports = {
    createFriends: createFriends,
    findFriends: findFriends,
    findFriend: findFriend,
    addFriend: addFriend
}