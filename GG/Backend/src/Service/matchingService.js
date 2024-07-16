import db from '../models/index';

let checkFriends = (user_native, user_target, user_id) => {
    return new Promise (async (resolve, reject) => {
        try{
            console.log("seventh check")
            console.log("user_native: ", user_native)
            let profiles = await db.UserProfile.findAll({
                //attributes: ['id'],
                where: {native_language : user_target},
                order: [['id', 'ASC']]
            })
            console.log("eighth check")
            console.log(profiles.length, " users found")
            let user = await db.UserProfile.findOne({
                where : {id : user_id}
            })
            let scores = [];
            let indices = [];
            let matches = [];
            let accounts = [];
            for (let i = 0; i < profiles.length; i++) {
                let profile = profiles[i]
                //console.log("Id: ", profiles[i].id)
                let account = await db.UserAccount.findOne({
                    where: {id: profiles[i].id}
                })
                accounts.push(account);
                let score = 6*(+ (profile.gender == user.gender)) + 5*(+ (profile.profession == user.profession)) + 5*(+ (profile.hobby == user.hobby)) - 0.3*(Math.abs(user.age-profile.age));
                scores.push(score);
                /* console.log("Name: ", account.firstName, " ", account.lastName)
                console.log("Age: ", profiles[i].age)
                console.log("Gender: ", profiles[i].gender)
                console.log("Profession: ", profiles[i].profession)
                console.log("Hobby: ", profiles[i].hobby)
                console.log("\n") */
            }
            let scorescopy = [...scores];
            let sortedscores = scorescopy.sort();
            let bestscores = sortedscores.slice(Math.max(sortedscores.length - 5, 1));
            for (let j = 4; j>= 0; j--) {
                let index = scores.indexOf(bestscores[j]);
                let fullName = accounts[index].firstName + " " + accounts[index].lastName;
                matches.push([fullName, profiles[index].dataValues]);
            }
            //return (user)
            //console.log(matches)
            resolve(matches)
        }catch(e){
            reject(e);
        }
    })
}



module.exports = {checkFriends}

//above code will return all instances

//maybe use findByPk to get a single entry using a primary key?
    // this can be incremented to go throught the entire table

    // let checkFriends = (id, native_language, target_language) => {
    //     return new Promise (async (resolve, reject) => {
    //         try{
    //             let array = []
    //             let user = await db.UserProfile.findByPk({
    //                 where: {id : id, native_language : target_language, target_language : native_language},
    //                 order: {limit: 5}
    //             })
    //             array.push(this.getDataValue('firstName'));
    //             console.log(user)
    //             if (user){
    //                 resolve(true)
    //             }else {
    //                 resolve(false)
    //             }
    //         }catch(e){
    //             reject(e);
    //         }
    //     })
    // }