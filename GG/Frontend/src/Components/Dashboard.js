import { useState, useEffect } from 'react';
import React from "react";
import './Dashboard.css';
import "../Styles/global.scss"; 
import profile from "../Styles/profilepic.jpg";
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleUserDashBoardApi } from '../Services/dashboardService';
import { handleFindFriendsApi, handleCreateFriendsApi } from '../Services/findFriendsService';
import { handleGetProfile, handleGetUser, handleMatch } from '../Services/userService';
import { setUserData } from '../Utils/userData';

function Dashboard()  {
  const [search] = useSearchParams();
  const id = search.get("id");
  const [FName, setFName] = useState();
  const [LName, setLName] = useState();
  const [email, setEmail] = useState();
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [hobby, setHobby] = useState();
  const [profession, setProfession] = useState();
  const [friendids, setfriendids] = useState([]);
  const [name, setName] = useState([]);
  const navigate = useNavigate();
  
  let names = []; 
  let array = [];
  let videoCalls = [];
  let data;

  const getInfo = async () => {
    try {
      data = await handleUserDashBoardApi(id);
      setFName(data.user.firstName);
      setLName(data.user.lastName);
      setEmail(data.user.email);
      setAge(data.user.age);
      setGender(data.user.gender);
      setHobby(data.user.hobby);
      setProfession(data.user.profession);

      // Store data for access in other components
      setUserData({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        age: data.user.age,
        gender: data.user.gender,
        hobby: data.user.hobby,
        profession: data.user.profession,
      });

      let lists = await handleFindFriendsApi(id);
      setfriendids(lists.chatsData);

      for(let i = 0; i < friendids.length; i++) {
        let friend = await handleUserDashBoardApi(friendids[i].user2_ID);
        let friendName = friend.user.firstName + ' ' + friend.user.lastName;
        names.push(friendName);
      }
      setName(names);
    } catch (error) {
      console.log(error);
    }
  };

  const setup = () => {
    for(let i = 0; i < friendids.length; i++) {
      console.log('name-i ' + name[i].name);
      console.log('logged in ' + name[i].loggedIn);
      if (name[i].loggedIn) {
        array.push(
          <div className='leftOnline'>
            <img src={profile} alt="DP" className="leftpic" />
            <text className='text'>{name[i]}</text>
          </div>
        );
      } else {
        array.push(
          <div className='leftOffline'>
            <img src={profile} alt="DP" className="leftpic" />
            <text className='text'>{name[i]}</text>
          </div>
        );
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const Logout = async (e) => {
    navigate({
      pathname: "/LogoutConfirmation",
      search: createSearchParams({
          id: id
      }).toString()
    });
  };

  const Translator = async (e) => {
    navigate({
      pathname: "/Translator",
      search: createSearchParams({
          id: id
      }).toString()
    });
  };

  const call = async (e) => {
    navigate({
      pathname: "/Videocall",
      search: createSearchParams({
          id: id
      }).toString()
    });
  };

  const handleChat = async (e) => {
    navigate({
      pathname: "/Chat",
      search: createSearchParams({
          senderid: id
      }).toString()
    });
  };

  const friendSearch = () => {
    navigate('/FriendSearch', { state: { id: id } });
  };

  const createVideoCall = () => {
    var channelId = Math.floor(10000 + Math.random() * 90000);
    for (let vc in videoCalls) {
      if (vc.user !== id) {
        videoCalls.push({
          user: id,
          channel: channelId
        });
      }
    }
    call();
  };

  const addFriend1 = async (e) => {
    try {
      console.log('friend add attempt');
      let data = await handleCreateFriendsApi(id, friendids[0].id);
    } catch(err) {
      console.log(err);
    }
  };

  const handleHelp = async (e) => {
    navigate({
      pathname: "/HelpPage",
      search: createSearchParams({
          id: id
      }).toString()
    });
  };

  for(let i = 0; i < friendids.length; i++) {
    array.push(
      <div className='left'>
        <img src={profile} alt="DP" className="leftpic" />
        <text className='text'>{name[i]}</text>
        <Button className="btn-help" onClick={createVideoCall}>📞</Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div classname="dashboard-info">
          <h1>Dashboard</h1>
<<<<<<< Updated upstream
          <img src={profile} alt="logo" className="center" />
          <h1>{FName} {LName}</h1>
          <h2>{email}</h2>
          {/* Removed the display of Age, Gender, Hobby, and Profession */}
          
          <Button className="btn-Screen" onClick={friendSearch}>Find Friend</Button>
          <Button className="btn-Screen" onClick={() => navigate({
                pathname: "/FriendsList",
                search: createSearchParams({ id: id }).toString()
              })}>
              Friends List
          </Button>
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
          {/*<h2>Friends</h2>*/}
          {/*<div className="friendlist">*/}
          {/*  {array}*/}
          {/*  <ListGroup id="friendlist">*/}
          {/*    <ListGroup.Item id="friendheader" hidden variant="success">Add a match below:</ListGroup.Item>*/}
          {/*    <ListGroup.Item id="friend1" onClick={addFriend1} hidden variant="success" action>Friend 1</ListGroup.Item>*/}
          {/*    <ListGroup.Item id="friend2" hidden variant="success" action href="#friend2">Friend 2</ListGroup.Item>*/}
          {/*    <ListGroup.Item id="friend3" hidden variant="success" action href="#friend3">Friend 3</ListGroup.Item>*/}
          {/*  </ListGroup>*/}
          {/*</div>*/}
=======
            <img src={profile} alt="logo" className="center" />
            <h2>{FName} {LName}</h2>
            <h2>{email}</h2>
            {/* Removed the display of Age, Gender, Hobby, and Profession */}
>>>>>>> Stashed changes
        </div>
        <button className="logout-button" onClick={Logout}>Logout</button>
        <button className="help-button" onClick={handleHelp}>?</button>
      </div>
      <div className="dashboard-grid">
        <button className="dashboard-button" onClick={friendSearch}>Find Friend</button>
        <button className="dashboard-button" onClick={() => navigate({
              pathname: "/FriendsList",
              search: createSearchParams({ id: id }).toString()
            })}>
            Friends List
        </button>
        <button className="dashboard-button" onClick={handleChat}>Chat</button>
        <button className="dashboard-button" onClick={call}>Call</button>
        <button className="dashboard-button" onClick={Translator}>Translator</button>
        <button className="dashboard-button" onClick={() => navigate({
              pathname: "/CreateProfile",
              search: createSearchParams({ id: id }).toString()
            })}>
            Set Profile
        </button>
      </div>
    </div>
  );
}

export default Dashboard;