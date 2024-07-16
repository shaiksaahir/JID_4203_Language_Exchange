import React, { useState } from "react";
import {handleGetUser, getMessages,  addMessage} from '../Services/userService';
import { useEffect } from "react";
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

import "./ChatBox.css";
import profile from "../Styles/profilepic.jpg";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji';
import { useRef } from "react";


const ChatBox = ({chat, currentUser, setSendMessage, receivedMessage}) => {
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const handleChange = (newMessage)=> {
        setNewMessage(newMessage)
    }
    const scroll = useRef();
    // fetching data for header
    useEffect(() => {
          //Change operator since chat is not always avail
          let userId = chat != null ? chat["receiverID"] : null
          if (currentUser == userId) {
            userId = chat != null ? chat["senderID"] : null
          }

          const getUserData = async () => {
            try {
              const data  = await handleGetUser(userId)
              setUserData(data);
            } catch (error) {
              console.log(error);
            }
          };

          if (chat !== null) getUserData();
    }, [chat, currentUser]);


  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(chat.id);
        setMessages(data.chatsData);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Receive Message from parent component
  useEffect(()=> {
    if (receivedMessage !== null && receivedMessage.chatId === chat.id) {
      setMessages([...messages, receivedMessage]);
    }

  },[receivedMessage, chat, messages])


    // Send Message
  const handleSend = async(e)=> {
      e.preventDefault()
      const message = {
        senderId : currentUser,
        text: newMessage,
        chatId: chat.id,
  }

  const receiverId = chat["receiverId"];
  console.log(receiverId);
  // send message to socket server
  setSendMessage([...messages, receiverId])
      // send message to database
      try {
            const data = await addMessage(message);
            setMessages([...messages, data.messageData]);
            setNewMessage("");
        }
      catch{
            console.log("error")
      }
  }

  // Always scroll to last Message
   useEffect(()=> {
      scroll.current?.scrollIntoView({ behavior: "smooth" });
   },[messages])

   return (
    <>
        <div className="ChatBox-container">
        {chat ? (
        <>
            {/*Chat Header*/}
            <div className="chat-header">
                <div className="follower">
                    <div>

                      <img
                        src={profile}
                        alt="Profile"
                        className="followerImage"
                        style={{ width: "50px", height: "50px", borderRadius: "50%",float: "left" }}
                      />
                      <div className="name" style={{fontSize: '0.8rem',textAlign: "left"}}>
                        <span>{userData?.firstName} {userData?.lastName}</span>
                      </div>
                    </div>
                </div>
                <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #bebebe",
                  marginTop: "20px",
                }}
              />
            </div>
            {/*Chat Message*/}
            <div className="chat-body" >
            {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId == currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
            ))}
            </div>
             {/* chat-sender */}
             <div className="chat-sender">
             <div>+</div>
              <InputEmoji
              value={newMessage}
              onChange={handleChange}
              />
              <button className="send-button" onClick = {handleSend}>Send</button>
             </div>
        </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
        </div>
    </>
    );
}
export default ChatBox;