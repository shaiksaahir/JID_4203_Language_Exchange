import db from '../models/index';

let handleUserDashBoard = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            // Fetch user data from UserAccount
            let userAccount = await db.UserAccount.findOne({
                where: { id: id },
                attributes: ['firstName', 'lastName', 'email']
            });

            // Fetch user profile data (age, gender, hobby, and profession) from UserProfile
            let userProfile = await db.UserProfile.findOne({
                where: { id: id },
                attributes: ['age', 'gender', 'hobby', 'profession']
            });

            if (userAccount) {
                userData.user = {
                    firstName: userAccount.firstName,
                    lastName: userAccount.lastName,
                    email: userAccount.email,
                    age: userProfile ? userProfile.age : null,
                    gender: userProfile ? userProfile.gender : null,
                    hobby: userProfile ? userProfile.hobby : null,
                    profession: userProfile ? userProfile.profession : null
                };
                userData.errCode = 0;
                userData.errMessage = 'OK';
            } else {
                userData.errCode = 2;
                userData.errMessage = 'User not found!';
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { handleUserDashBoard };