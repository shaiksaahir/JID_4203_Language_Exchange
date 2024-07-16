import express from "express";
import APIController from "../controller/APIController";

let router = express.Router();

const initAPIRoute = (app) => { 
    router.get('/users', APIController.getAllUsers); // method get
    router.post('/create-user', APIController.createNewUser); // method post
    router.put('/update-user', APIController.updateUser); // method put
    router.delete('/delete-user/:id', APIController.deleteUser); // method delete
    return app.use('/api/v1/', router)
}

export default initAPIRoute;