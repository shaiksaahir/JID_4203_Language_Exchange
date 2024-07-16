import matchingService from '../Service/matchingService';
import userService from '../Service/userService';

 let handleMatchingFriends = async (req, res) => {
    console.log("Check B")
    let id = req.params.userId
    let userNative = req.params.userNative
    let userTarget = req.params.userTarget
    let arrayOfName = {}

   // Call handleUserLogin to have the value of userData
   console.log("Sixth Check")
   let userData = await matchingService.checkFriends(userNative, userTarget, id)
   /* console.log("Match: ", userData[0])
   userData.forEach(stat => {
     console.log(stat.id);
     let userFirstName = userService.getUserInfoById(stat.id)
     arrayOfName.push(userFirstName.firstName)
 });
    return arrayOfName  */
    console.log(userData)
    return res.send(userData)


   return res.send(arrayOfName)
}

let handleGetUser = async (req, res) => {
  const userId = req.params.userId
  console.log("check id >>>", userId)
  if (userId) {
      let userData = await userService.getUserInfoById(userId)
      return res.send(userData)

  }else {
      return res.send("User not found !");
  }
}


let handleGetUserFirstName = async (req, res) => {
  const userId = req.params.userId
  const arrayOfName = {}
  
  // let userData = userService.getUserInfoById(userId)
  // arrayOfName.push(userData.firstName)
  // return arrayOfName
  // return res.send(userData.firstName)


  let userData = await matchingService.checkFriends(id, userNative, userTarget)
  let userName = userService.handleGetUser(userId)
  console.log(userData)
  console.log(userName)
  // userData.forEach(stat => {

  for (let i = 0; i < 4; i++) {
    userName = userService.getUserInfoById(userData[i].id)
    arrayOfName.push(userName)
  }
  return res.send(arrayOfName)
}



module.exports = {
  handleMatchingFriends: handleMatchingFriends,
  handleGetUser: handleGetUser,
  handleGetUserFirstName: handleGetUserFirstName
}