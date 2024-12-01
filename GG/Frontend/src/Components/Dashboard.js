import { useState, useEffect } from 'react';
import React from "react"; 
import './Dashboard.css';
import profile from "../Styles/profilepic.jpg";
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
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

  const goToUserReport = () => {
    navigate({
      pathname: "/UserReport", 
      search: createSearchParams({
        id: id, 
      }).toString(),
    });
  };

  const friendSearch = () => {
    navigate({
      pathname: "/FriendSearch",
      search: createSearchParams({
        id: id,
      }).toString(),
    });
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
        <button onClick={createVideoCall}>📞</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <div className="dashboard-left">
        <h1>Dashboard</h1>
        <img src={profile} alt="logo" className="center" />
        <h1>{FName} {LName}</h1>
        <h2>{email}</h2>
        <div classname="dashboard-left-buttons">
          <button className="btn-questions" onClick={handleHelp}>?</button>
          <button className="btn-logout" onClick={Logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-right">
      <button className="btn-action" onClick={() => navigate({
                pathname: "/CreateProfile",
                search: createSearchParams({ id: id }).toString()
              })}>
              Set Profile
          </button>
        <button className="btn-action" onClick={friendSearch}>Find Friend</button>
          <button className="btn-action" onClick={() => navigate({
                pathname: "/FriendsList",
                search: createSearchParams({ id: id }).toString()
              })}>
              Friends List
          </button>
          <button className="btn-action" onClick={call}>Call</button>
          <button className="btn-action" onClick={Translator}>Translator</button>
          <button className="btn-action" onClick={goToUserReport}>User Report</button>
      </div>

    </div>
  );
}

export default Dashboard;