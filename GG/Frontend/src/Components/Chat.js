import { useState, useEffect } from 'react';
import { useRef} from "react";
import "./Chat.css";
import Conversation from "./Conversation";
import ChatBox from "./ChatBox";
import LogoSearch from "./LogoSearch";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import {handleChatApi, handleGetUser} from '../Services/userService';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';

const Chat = () => {

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const[search] = useSearchParams();
    const senderId = search.get("senderid"); //login user_id
    const user = handleGetUser(senderId); //login user info
    const socket = useRef();
    const [sendMessage, setSendMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const navigate = useNavigate();
    const id = search.get("id");

    // Get the chats which come from current login user to display as chat lists
    useEffect(() => {
        const getChats = async () => {
            try {
            //data = object of ChatModel {chatId, senderId, receiverId}
                const data  = await handleChatApi(senderId);
                setChats(data.chatsData);
            } catch (error) {
                console.log(error);
            }
        };
        getChats();
    }, [senderId]);

     // Connect to Socket.io
    useEffect(() => {
        socket.current = io("ws://localhost:8800");
        socket.current.emit("new-user-add", senderId);
        socket.current.on("get-users", (users) => {
          setOnlineUsers(users);
        });
    }, [user]);

    // Send Message to socket server
    useEffect(() => {
        if (sendMessage!==null) {
          socket.current.emit("send-message", sendMessage);}
    }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });

  }, []);

   const checkOnlineStatus = (chat) => {
      const chatMember = chat["receiverId"];
      console.log(onlineUsers);
      const online = onlineUsers.find((user) => user.userId == chatMember);
      return online ? true : false;
   };

   const handleBack = async (e) => {
    navigate({
      pathname: "/Dashboard",
      search: createSearchParams({
        id: id
      }).toString()
    });
  };

   return (
        <div className="Chat">
            {/* Left Side */}
            <div className="Left-side-chat">
            <LogoSearch />
                <div className="Chat-container">
                    <h2>Chats</h2>
                    <div className="Chat-list">
                        {chats.map((chat) => (
                        <div onClick={() => {
                        setCurrentChat(chat);
                        }}
                        >
                            <Conversation
                              data={chat} // send prop data to Conversation - data
                              currentUserId={senderId} // user_id that currently login and send as prop to Conversation - currentUserId
                              online={checkOnlineStatus(chat)}
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="Right-side-chat">
            <ChatBox
              chat={currentChat}
              currentUser={senderId}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}
              />
            </div>

            <div>
            <Button className="btn-help" onClick={handleBack}>Back</Button>
            </div>
        </div>
    );
}
export default Chat;