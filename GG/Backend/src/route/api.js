import express from "express";
import APIController from "../controller/APIController";

let router = express.Router();

//TOWNSHEND: added an additional router to get user names
const initAPIRoute = (app) => { 
    router.get('/users', APIController.getAllUsers); // method get
    router.post('/create-user', APIController.createNewUser); // method post
    router.put('/update-user', APIController.updateUser); // method put
    router.delete('/delete-user/:id', APIController.deleteUser); // method delete
    router.get('/user-names', APIController.getUserNames); // GET method to fetch user names
    router.get('/user-preferences', APIController.getUserPreferences);
    router.post('/addFriend', APIController.addFriend);
    router.get('/getUserProfile/:userId', APIController.getUserProfile);
    router.post('/update-rating', APIController.updateRating);
    router.post('/update-proficiency', APIController.updateProficiency);
    router.post('/add-comment', APIController.addComment);
    router.get('/getUserProficiencyAndRating/:userId', APIController.getUserProficiencyAndRating);
    router.post('/addToFriendsList', APIController.addToFriendsList);
    router.get('/getFriendsList', APIController.getFriendsList);
  
    return app.use('/api/v1/', router)
}

export default initAPIRoute;