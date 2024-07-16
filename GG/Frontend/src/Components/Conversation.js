import React, { useState } from "react";
import { useEffect } from "react";
import {handleGetUser} from '../Services/userService';
import profile from "../Styles/profilepic.jpg";



//Display conversation header on the right side = name of person current user have chats with - receiverId
const Conversation = ({data, currentUser, online}) => {
    const [userData, setUserData] = useState(null)
     useEffect(()=> {
        const userId = data["receiverId"]
        const getUserData = async ()=> {
          try
          {
             const data =await handleGetUser(userId) // data of receiver
             setUserData(data)
          }
          catch(error)
          {
            console.log(error)
          }
        }
        getUserData();
     }, [data])

    return (
        <>
              <div className="follower conversation">
                <div>
                  {online && <div className="online-dot"></div>}
                  <img
                    src={profile}
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px", borderRadius: "50%",float: "left" }}
                  />
                  <div className="name" style={{fontSize: '0.8rem'}}>
                    <span>{userData?.firstName} {userData?.lastName}</span>
                    <br></br>
                    <span style={{color : online ? "#51e200" : ""}}>{online? "Online" : "Offline"}</span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "100%", border: "0.2px solid #bebebe" }} />
            </>
    );
}
export default Conversation;