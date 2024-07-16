import userService from '../Service/userService';

let currUser = null

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: "Missing username or/and password"
        })

    }
    // Call handleUserLogin to have the value of userData
    let userData = await userService.handleUserLogin(email, password)
    currUser = userData

    return res.status(200).json({
         errorCode: userData.errCode,
         message: userData.errMessage,
         id: userData.id,
         user: userData.user? userData.user : {}
    })
}

let handleRegister = async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: "Missing username or/and password"
        })

    }
    let save = true
    // Call handleUserLogin to have the value of userData
    let userData = await userService.handleUserRegister(firstName,lastName, email, password, save)
    currUser = userData
    console.log(userData.id);

    return res.status(200).json({
         errorCode: userData.errCode,
         message: userData.errMessage,
         id: userData.id,
         user: userData.user? userData.user : {}
    })
}

let handleProfileCreation = async (req, res) => {
    console.log("hi")
    let native_language = req.body.native_language;
    let target_language = req.body.target_language;
    let target_language_proficiency = req.body.target_language_proficiency;
    let age = req.body.age;
    let gender = req.body.gender;
    let profession = req.body.profession;
    let hobby = req.body.hobby;
    let id = req.body.id
    let save = true
    //console.log("Id passed to profile controller is: ", id)
    // Call handleProfileCreation to have the value of userData
    let userData = await userService.handleProfileCreation(id, native_language, target_language, target_language_proficiency, age, gender, profession, hobby, save)
    console.log(userData)
    return res.status(200).json({
         errorCode: userData.errCode,
         message: userData.errMessage,
         user: userData.user? userData.user : {}
    })
}

let handleDataPopulation = async (req, res) => {
    let languages = ["English", "Korean"];
    let genders = ["Male", "Female", "Other"];
    let professions = ["Education", "Engineering", "Retail", "Finance", "Law", "Medecine"];
    let hobbies = ["Reading", "Sport", "Gardening", "Workout", "Music", "Art", "Photography", "Writing", "Gaming", "Cooking", "Fishing"];
    let proficiencies = ["Beginner", "Elementary", "Intermediate", "Proficient", "Fluent"];
    for (let i=0; i<100; i++) {
        let fName = "SampleUser_" + i
        let lName = "SampleUser_" + i
        let email = "DummyDataEmail_" + i
        let pass = "Password"
        let random_index = Math.floor(Math.random() * 2);
        let native = languages[random_index];
        let target = languages[((random_index+1)%2)];
        let age = 18 + Math.floor(Math.random() * 18);
        let gender = genders[Math.floor(Math.random() * 3)];
        let profession = professions[Math.floor(Math.random() * 6)];
        let hobby = hobbies[Math.floor(Math.random() * 11)];
        let proficiency = proficiencies[Math.floor(Math.random() * 5)];
        let userData = await userService.handleDataPopulation(fName, lName, email, pass, native, target, age, gender, proficiency, profession, hobby)
    }
}

let handleGetUser = async (req, res) => {
    console.log("Second Check")
    const userId = req.params.userId
    if (userId) {
        let userData = await userService.getUserInfoById(userId)
        return res.send(userData)

    }else {
        return res.send("User not found !");
    }
}

let handleGetProfile = async (req, res) => {
    console.log("Fourth Check")
    const userId = req.params.userId
    if (userId) {
        let userData = await userService.getProfileById(userId)
        return res.send(userData)

    }else {
        return res.send("User not found !");
    }
}

let handleTranslator = async (req, res) => {
    let en = req.body.en;
    let ko = req.body.ko;
    let userData = await userService.handleTranslator(en, ko);
    console.log(userData);
    return res.status(200).json({
        errorCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user? userData.user : {}
    });
}

let handleLogout = async (req, res) => {
    //const userId = req.params.userId
    console.log('curr: ' + currUser.id)
    if (currUser) {
        let userData = await userService.handleUserLogout(currUser.id)
        return res.status(200).json({
            errorCode: userData.errCode,
            message: userData.errMessage,
            id: userData.id,
            user: userData.user? userData.user : {}
       })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleRegister: handleRegister,
    handleProfileCreation: handleProfileCreation,
    handleGetUser : handleGetUser,
    handleTranslator : handleTranslator,
    handleGetProfile : handleGetProfile,
    handleDataPopulation : handleDataPopulation,
    handleLogout : handleLogout
}