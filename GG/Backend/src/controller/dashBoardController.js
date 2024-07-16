import dashboardService from '../Service/dashboardService';

let handleDashBoard = async (req, res) => {
    let id = req.body.id
    if (!id) {
        console.log(id)
        return res.status(500).json({
            errorCode: 1,
            message: "Missing username or/and password"
        })

    }
     // Call handleUserLogin to have the value of userData
    let userData = await dashboardService.handleUserDashBoard(id)

    return res.status(200).json({
         errorCode: userData.errCode,
         message: userData.errMessage,
         user: userData.user? userData.user : {}
    })
}

module.exports = {
    handleDashBoard: handleDashBoard
}