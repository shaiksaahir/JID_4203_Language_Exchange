import db from '../models/index';

let handleUserDashBoard = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            // Return obj to Controller and the Controller will response to the user
            let userData = {};
    
            let user = await db.UserAccount.findOne({
                    where: {id: id}
                });
                if (user){
                    userData.user = user;
                }else {
                    userData.errCode = 2;
                    userData.errMessage = 'Username was no longer exist!'
                }
                resolve(userData);
            }
            
        catch(e){
            reject(e)
        }
    })
}

module.exports = {handleUserDashBoard}