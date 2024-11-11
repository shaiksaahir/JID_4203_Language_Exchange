import logo from './logo.svg';
//import React from "react";
import './App.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "../Components/Home";
import Registration from "../Components/Registration";
import Login from '../Components/Login';
import React, { Component }  from 'react';
import CreateProfile from '../Components/CreateProfile';
import Dashboard from '../Components/Dashboard';
import LogoutConfirmationPage from '../Components/LogoutConfirmationPage';
import Chat from '../Components/Chat';
import { Provider } from "react-redux";
import store from "../store/ReduxStore";
import { useDispatch } from "react-redux";
import HelpPage from '../Components/HelpPage';
import Translator from "../Components/Translator";
import Videocall from "../Components/Videocall";
import PostVideocall from '../Components/PostVideocall';
import FriendSearch from '../Components/FriendSearch';
import FriendsList from '../Components/FriendsList';
import UserReport from '../Components/UserReport';

const App = () => {


  return (
    <div className="App">

      <Router>
       <Routes>
          <Route path ="/" element ={<Home />}/>
          <Route path ="/Login" element ={<Login/>}/>
          <Route path ="/Register" element ={<Registration />}/>
          <Route path ="/CreateProfile" element ={<CreateProfile />}/>
          <Route path ="/Dashboard" element ={<Dashboard />}/>
          <Route path ="/FriendSearch" element ={<FriendSearch />}/>
          <Route path ="/Translator" element = {<Translator />}/>
          <Route path="/UserReport" element={<UserReport />} />
          <Route path ="/Videocall" element = {<Videocall />}/>
          <Route path ="/PostVideocall" element = {<PostVideocall />}/>
          <Route path ="/LogoutConfirmation" element ={<LogoutConfirmationPage />}/>
          <Route path ="/Chat" element ={<Chat/>}/>
          <Route path ="/HelpPage" element ={<HelpPage/>}/>
          <Route path="/FriendsList" element={<FriendsList/>}/>
       </Routes>
      </Router>

    </div>
  );
}

export default App;