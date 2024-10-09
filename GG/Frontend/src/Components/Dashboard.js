import { useState, useEffect } from 'react';
import React from "react";
import './Registration.css'; 
import './Dashboard.css'; 
import profile from "../Styles/profilepic.jpg";

import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import { handleUserDashBoardApi } from '../Services/dashboardService';
import { handleFindFriendsApi, handleCreateFriendsApi } from '../Services/findFriendsService';
import { handleGetProfile, handleGetUser, handleMatch } from '../Services/userService';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';


function Dashboard()  {

  //const [errMessage setErrMsg] = useState('');
  const[search] = useSearchParams();
  const id = search.get("id");
  const [FName, setFName] = useState();
  const [LName, setLName] = useState();
  const [email,setEmail] = useState();
  const[friendids, setfriendids] = useState([]);
  const[name, setName] = useState([]);
  const navigate = useNavigate();
  // it should be coming from friend list database a list of id and names to show
  
  
  
  //let friendids = [];
  //let name = ["prit","quyen","maisa","akshar","pratham"];
  let names = [] 
  let array = []

  let videoCalls = []

  let data;
  
  //console.log(data);
  const getInfo = async(e) => {
      try{
        data = await handleUserDashBoardApi(id);
        setFName(data.user.firstName);
        setLName(data.user.lastName);
        setEmail(data.user.email);
        //console.log("start")
        let lists = await handleFindFriendsApi(id);
        setfriendids(lists.chatsData)
        //console.log('friends list length: ' + friendids.length)
        for(let i = 0; i < friendids.length; i++) {
          let friend = await handleUserDashBoardApi(friendids[i].user2_ID);
          let friendName = friend.user.firstName + ' ' + friend.user.lastName
          names.push(friend.user.firstName)
        }
        setName(names)

        }
    catch(error){
      console.log(error);
    }

  }

  const setup = () => {
    for(let i = 0; i < friendids.length; i++) {
      console.log('name-i ' + name[i].name)
      console.log('logged in ' + name[i].loggedIn)
      if (name[i].loggedIn) {
        array.push(
          <div className='leftOnline'>
            <img src={profile} alt="DP" className ="leftpic" />
            <text className='text'>{name[i]}</text>
          </div>
        );
      } else {
        array.push(
          <div className='leftOffline'>
            <img src={profile} alt="DP" className ="leftpic" />
            <text className='text'>{name[i]}</text>
          </div>
        );
      }
    }
  }

  useEffect(() => {
    getInfo()
    //setup()
  });
  
  const Logout = async(e) => {
    navigate({
      pathname: "/LogoutConfirmation",
      search: createSearchParams({
          id: id
      }).toString()
  });

  }
  const Translator = async(e) => {
    navigate({
      pathname: "/Translator",
      search: createSearchParams({
          id: id
      }).toString()
  });

  }
  const call = async(e) => {
    navigate({
      pathname: "/Videocall",
      search: createSearchParams({
          id: id
      }).toString()
  });

  }
  const handleChat = async(e) => {
    navigate({
      pathname: "/Chat",
      search: createSearchParams({
          senderid: id
      }).toString()
  });
  }
  //TOWNSHEND: re-purposed Find Friends button to navigate to FriendSearch page
  const friendSearch = async(e) => {
    navigate({
      pathname: "/FriendSearch",
      search: createSearchParams({
          senderid: id
      }).toString()
  });
  }

  const createVideoCall = () => {
    var channelId = Math.floor(10000 + Math.random() * 90000)
    for (let vc in videoCalls) {
      if (vc.user != id) {
        videoCalls.push({
          user: id,
          channel: channelId
        })
      }
    }
    call()
  }

  function friendsList() {
    return 
  }

  const addFriend1 = async(e) => {
    try {
      console.log('friend add attempt')
      let data = await handleCreateFriendsApi(id, friendids[0].id);
    } catch(err) {

    }
  }

  /** let friends = []
  const match = async(e) => {
    try {
      console.log("First Check")
      let data = await handleGetUser(id)
      console.log(data.firstName)
      let data2 = await handleGetProfile(id)
      console.log(data2.native_language)
      let data3 = await handleMatch(id, data2.native_language, data2.target_language);
      console.log("ninth check")
      document.getElementById("friendheader").removeAttribute("hidden")
      for (let i = 0; i < 5; i++){
        console.log(data3[i][0])
        console.log(data3[i][1])
        if (i < 3) {
          document.getElementById("friend" + (i+1)).textContent = data3[i][0]
          document.getElementById("friend" + (i+1)).removeAttribute("hidden")
          friends.push(data3[i][1])
        }
      }

      console.log('testtttttt ', friends[0])
    } catch (error) {
      console.log(error);
    }
  } **/

  const handleHelp = async(e) => {
    navigate({
      pathname: "/HelpPage",
      search: createSearchParams({
          id: id
      }).toString()
  });
  }
  // let array = [];
  // for(let i = 0; i < friendids.length; i++) {
  //   console.log('name-i ' + names[i].name)
  //   console.log('logged in ' + names[i].loggedIn)
  //   if (names[i].loggedIn) {
  //     array.push(
  //       <div className='leftOnline'>
  //         <img src={profile} alt="DP" className ="leftpic" />
  //         <text className='text'>{name[i]}</text>
  //       </div>
  //     );
  //   } else {
  //     array.push(
  //       <div className='leftOffline'>
  //         <img src={profile} alt="DP" className ="leftpic" />
  //         <text className='text'>{name[i]}</text>
  //       </div>
  //     );
  //   }
  //   //console.log('name-i ' + name[i])
  //   // array.push(
  //   //   <div className='left'>
  //   //     <img src={profile} alt="DP" className ="leftpic" />
  //   //     <text className='text'>{name[i]}</text>
  //   //   </div>
  //   // );
  // }
  
  for(let i = 0; i < friendids.length; i++) {
    array.push(
      <div className='left'>
        <img src={profile} alt="DP" className ="leftpic" />
        <text className='text'>{name[i]}</text>
        <Button className="btn-help" onClick={createVideoCall}>📞</Button>
      </div>
    );
  }

  return (
    
    <div className="screen-Background">
      <div  className="screen-Container">
      <div className="screen-Content">
        
        <h1 >Dashboard</h1>
        <img src={profile} alt="logo" className="center" />
        <h1>{FName} {LName}</h1>
        <h2>{email}</h2>
        
        <Button className="btn-Screen" onClick={friendSearch}>Find Friend</Button>
        <Button className="btn-Screen" onClick={handleChat}>Chat</Button>
        <Button className="btn-Screen" onClick={call}>Call</Button>
        <Button className="btn-Screen" onClick={Translator}>Translator</Button>
        <Button className="btn-Screen" onClick={() => navigate({
              pathname: "/CreateProfile",
              search: createSearchParams({ id: id }).toString()
            })}>
            Set Profile
          </Button>
        <Button className="btn-Screen" onClick={Logout}>
          Logout
        </Button>
        <h2>Friends</h2>
        <div className="frientlist">
          {array}
          <ListGroup id="friendlist">
            <ListGroup.Item id="friendheader" hidden variant="success">Add a match below:</ListGroup.Item>
            <ListGroup.Item id="friend1" onClick={addFriend1} hidden variant="success" action>Friend 1</ListGroup.Item>
            <ListGroup.Item id="friend2" hidden variant="success" action href="#friend2">Friend 2</ListGroup.Item>
            <ListGroup.Item id="friend3" hidden variant="success" action href="#friend3">Friend 3</ListGroup.Item>
          </ListGroup>
        </div>
        </div>
        <Button className="btn-help" onClick={handleHelp} >?</Button>
        </div>
      </div>
  
    
  );
    
}
export default Dashboard;