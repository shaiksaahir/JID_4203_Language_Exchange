import { useState } from 'react';
import React from "react";
import './Registration.css'; 

import Button from 'react-bootstrap/Button';
import { handleRegisterApi } from '../Services/userService';
import { createSearchParams, useNavigate } from "react-router-dom";

function Registration() {
    // States for registration
  let data;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg ,setErrMsg] = useState('');

 
  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
 
  

  // Handling the name change
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
    setSubmitted(false);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };
 
  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  const handleBack = () => {
    navigate({
      pathname: "/login", // Navigate to Registration page
    });
  };
 
  // Handling the form submission
  const handleSubmit = async(e) => {
    console.log(data)
    e.preventDefault();
    if (firstName === '' || lastName === '' || email === '' || password === '') {
      setError(true);
      setErrMsg("enter all the fields");
    } else {
      setError(false);
      //navigate("/CreateProfile");  
    setErrMsg("");
    try{
      console.log('Sending Register: ' + firstName + lastName+ email+ password);
      let data = await handleRegisterApi(firstName,lastName,email, password);
      console.log("fj");
      if (data && data.errCode !== 0){
          setSubmitted(true);
          setError(true);
          setErrMsg(data.message);
      }
      if (data && data.errorCode === 0){
        console.log("here");
      // todo when login successfull!
      navigate({
        pathname: "/CreateProfile",
        search: createSearchParams({
            id: data.id
        }).toString()
    });
      }
  }catch(error){
      if (error.response){
          if (error.response.data){
                  setErrMsg(error.response.data.message)
                  console.log(errMsg)

          }
      }
  }
  }
  };
 
  
 
  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>{errMsg}</h1>
      </div>
    );
  };
 
  return (
    <div className="login-background">
      <div className="visual-section">
              {/* Add optional branding or visuals here */}
              Welcome Back!
      </div>
      <div className="login-container">
        <div className="login-content">
          <div classname="text-login"><h1>Registration</h1></div>
          <div>
            {errorMessage()}
          </div>
          <form>
            <div className="login-content">
            {/* Labels and inputs for form data */}

            <div>  {/*/First Name Input */}
            <label className="button-header">First Name:</label>
            <input 
            placeholder ="Enter First Name.." 
            onChange={handleFirstName}
              value={firstName} type="text" />
            </div>

            <div>
            <label className="button-header">Last Name:</label>
            <input 
            placeholder ="Enter Last Name.." 
            onChange={handleLastName}
              value={lastName} type="text"/>
            </div>

            <div>
            <label className="button-header">Email:</label>
            <input
            placeholder ="Enter Email.." 
            onChange={handleEmail}
              value={email} type="text"/>
            </div>

            <div>
            <label className="button-header">Password:</label>
            <input
            placeholder ="Enter Password.." 
            onChange={handlePassword}
              value={password} type="text"/>
            </div>

            <button className="btn-login"  onClick={handleSubmit}>
              Create Profile
            </button>
            <div
                className="login"
                style={{
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "normal",
                    transition: "color 0.3s ease",
                }}
                onClick={handleBack}
                onMouseEnter={(e) => (e.target.style.color = "#6344A6")}
                onMouseLeave={(e) => (e.target.style.color = "black")}
                >Already have an account? Login!
             </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
    
}
export default Registration;