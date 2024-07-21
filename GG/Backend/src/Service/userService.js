import db, { sequelize } from '../models/index';
import bcrypt from 'bcryptjs';

let user_id = null
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist){
                //use already exists
                //Then, compare password
                //1. Check again if later there someone delete that user in the database after we check
                let UserAccount = await db.UserAccount.findOne({
                    where: {email: email}
                });
                if (UserAccount){
                    //Compare password, using bycrypt lib
                    let check = await bcrypt.compareSync(password, UserAccount.password);
                    if (check){
                        userData.errCode = 0;
                        userData.errMessage = 'Password matched!'
                        userData.UserAccount = UserAccount;
                        user_id = UserAccount['dataValues']['id']
                        userData.id =  user_id
                        UserAccount.loggedIn = true;
                        await UserAccount.save();
                        userData.loggedIn = true;
                        console.log(user_id)
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password!'
                    }
                }else {
                    userData.errCode = 2;
                    userData.errMessage = 'Username no longer exists!'
                }
            }else {
                /*userDate object {
                errCode: 1
                errMessage: "username not exist"
                }
                */
                userData.errCode = 1;
                userData.errMessage = 'Invalid email!'
            }
            resolve(userData);
        }catch(e){
            reject(e)
        }
    })
}

let handleUserRegister = (firstName, lastName, email, password, save) => {
    return new Promise(async (resolve, reject) => {
        try{
            // Return obj to Controller and the Controller will response to the user
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist){
                console.log("Email taken")
                //user already exists
                //Then, compare password
                //1. Check again if later there someone delete that user in the database after we check
                userData.errCode = 1;
                userData.errMessage = 'User already exists';
            }
            else {
                /*userDate object {
                errCode: 1
                errMessage: "username not exist"
                }
                */
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                let UserAccount = await db.UserAccount.build({
                    email: email,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    loggedIn: true
                });
                if (save) {
                    await UserAccount.save()
                }
                //console.log("tenth check")
                console.log("name: ", UserAccount.firstName)
                //console.log("id: ", UserAccount.id);
                userData.errCode = 0;
                userData.errMessage = 'Successfully Registered';
                //user_id = UserAccount['dataValues']['id']
                let user_id = UserAccount.get('id')
                console.log("id: ", user_id);
                userData.id = user_id
                }
            resolve(userData);
    
        }catch(e){
            reject(e)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise (async (resolve, reject) => {
        //findOne() --> return undefine if no user found
        try{
            let user = await db.UserAccount.findOne({
                where: {email : userEmail}
            })
            console.log(userEmail)
            if (user){
                resolve(true)
            }else {
                resolve(false)
            }
        }catch(e){
            reject(e);
        }
    })
}

let handleProfileCreation = (id, native_language, target_language, target_language_proficiency, age, gender, profession, hobby, mbti, dates_available, times_available, visibility, save) => {
    return new Promise(async (resolve, reject) => {
        try{
            let userData = {};
            console.log("id passed to user service is: ", id)
            let userProfile = await db.UserProfile.build({
                id: id,
                native_language: native_language,
                target_language: target_language,
                target_language_proficiency: target_language_proficiency,
                age: age,
                gender: gender,
                profession: profession,
                hobby: hobby,
                mbti: mbti,
                dates_available: dates_available,
                times_available: times_available,
                visibility: visibility
            });
            if(save) {
                await userProfile.save()
            } 
            console.log("Id passed to profile is: ", userProfile.id)
            console.log(userProfile);
            userData.errCode = 0;
            userData.errMessage = 'Profile Successfully Created!';
            resolve(userData);
        }catch(e){
            reject(e)
        }
    })
}

let handleDataPopulation = (fName, lName, email, pass, native, target, age, gender, proficiency, profession, hobby, mbti, dates, times, visibility) => {
    return new Promise(async (resolve, reject) => {
        try{
            //await db.UserAccount.truncate()
            //await db.UserProfile.truncate()
            let userData = {};
            let account = await handleUserRegister(fName, lName, email, pass, true)
            let id = account.id
            console.log("id from account is: ", id)
            let profile = await handleProfileCreation(id, native, target, proficiency, age, gender, profession, hobby, mbti, dates, times, visibility, true)
            console.log("hi");
            userData.errCode = 0;
            userData.errMessage = 'Data Successfully Populated!';
            resolve(userData);
        }catch(e){
            reject(e)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise (async (resolve, reject) => {
        try{
            console.log("Third Check")
            let user = await db.UserAccount.findOne({
                where: {id: userId}
            })
            console.log(userId)
            if (user){
                resolve(user);
            }else {
                resolve([]);
            }
        }catch(e){
            reject(e);
        }
    })
}

let getProfileById = (userId) => {
    return new Promise (async (resolve, reject) => {
        try{
            console.log("Fifth Check")
            let user = await db.UserProfile.findOne({
                where: {id: userId}
            })
            console.log(userId)
            if (user){
                resolve(user);
            }else {
                resolve([]);
            }
        }catch(e){
            reject(e);
        }
    })
}

let handleTranslator = (en, ko) => {
    return new Promise (async (resolve, reject) => {
        try {
            let userTranslation = await db.UserTranslations.create({
                en: en,
                ko: ko
            });
            console.log("translation");
        } catch(e) {
            reject(e);
        }
    })
}

let handleUserLogout = (id) => {
    return new Promise(async (resolve, reject) => {
        let userData = {};
        try {
            let UserAccount = await db.UserAccount.findOne({
                where: {id: id}
            });
            if (UserAccount) {
                userData.errCode = 0
                userData.UserAccount = UserAccount
                user_id = UserAccount['dataValues']['id']
                userData.id = user_id
                UserAccount.loggedIn = false
                await UserAccount.save()
                userData.loggedIn = false
                console.log('Log out ' + user_id)
            }
            resolve(userData)
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
handleUserLogin, checkUserEmail, handleUserRegister, handleProfileCreation, getUserInfoById, handleTranslator, getProfileById, handleDataPopulation, handleUserLogout
}