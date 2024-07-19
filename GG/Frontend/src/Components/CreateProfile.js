import { useState } from 'react';
import React from "react";
import './Registration.css'; 
import './CreateProfile.css'; 
import Select from "react-select";

import Button from 'react-bootstrap/Button';

import { handleProfileCreationAPI } from '../Services/userService';
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";


function CreateProfile() {
    // States for registration
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [targetLanguageProficiency, setTargetLanguageProficiency] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [hobby, setHobby] = useState('');
  const [mbti, setMBTI] = useState('');
  const [errMsg ,setErrMsg] = useState('');
  
  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
 
 const NativeLanguage = [
  {value: "English", label: "English"},
  {value: "Korean", label: "Korean"},
 ]

 const TargetLanguage = [
  {value: "English", label: "English"},
  {value: "Korean", label: "Korean"},
 ]
 const TargetLanguageProficiency = [
  {value: "Beginner", label: "Beginner"},
  {value: "Elementary", label: "Elementary"},
  {value: "Intermediate", label: "Intermediate"},
  {value: "Proficient", label: "Proficient"},
  {value: "Fluent", label: "Fluent"},
 ]

 const Gender = [
  {value: "Male", label: "Male"},
  {value: "Female", label: "Female"},
  {value: "Other", label: "Other"},
 ]

 const Profession = [
  {value:"Education", label:"Education"},
  {value:"Engineering", label: "Engineering"},
  {value:"Retail", label:"Retail"},
  {value:"Finance", label:"Finance"},
  {value:"Law", label:"Law"},
  {value:"Medecine", label:"Medecine"},
  {value:"Scientist", label:"Scientist"},
 ]
 const Hobby = [
  {value:"Reading", label:"Reading"},
  {value:"Sport", label: "Sport"},
  {value:"Gardening", label:"Gardening"},
  {value:"Workout", label:"Workout"},
  {value:"Music", label:"Music"},
  {value:"Art", label:"Art"},
  {value:"Photography", label:"Photography"},
  {value:"Writing", label:"Writing"},
  {value:"Gaming", label:"Gaming"},
  {value:"Cooking", label:"Cooking"},
  {value:"Fishing", label:"Fishing"},
 ]

 const MBTI = [
  {value:"Architect", label:"Architect"},
  {value:"Logician", label: "Logician"},
  {value:"Commander", label:"Commander"},
  {value:"Debater", label:"Debater"},
  {value:"Advocate", label:"Advocate"},
  {value:"Mediator", label:"Mediator"},
  {value:"Protagonist", label:"Protagonist"},
  {value:"Campaigner", label:"Campaigner"},
  {value:"Logistician", label:"Logistician"},
  {value:"Defender", label:"Defender"},
  {value:"Executive", label:"Executive"},
  {value:"Consul", label:"Consul"},
  {value:"Virtuoso", label:"Virtuoso"},
  {value:"Adventurer", label:"Adventurer"},
  {value:"Entrepreneur", label:"Entrepreneur"},
  {value:"Entertainer", label:"Entertainer"},
 ]




 const handleNativeLanguage = (selectedOption) => {
  console.log(selectedOption.value)
  setNativeLanguage(selectedOption.value);
 };

 const handleTargetLanguage = (selectedOption) => {
  setTargetLanguage(selectedOption.value);
 };
 const handleTargetLanguageProficiency = (selectedOption) => {
  setTargetLanguageProficiency(selectedOption.value);
 };

 const handleAge = (e) => {
  setAge(e.target.value);
 };

 const handleGender = (selectedOption) => {
  setGender(selectedOption.value);
 };
 const handleProfession = (selectedOption) => {
  setProfession(selectedOption.value);
 };
 const handleHobby = (selectedOption) => {
  setHobby(selectedOption.value);
 };

 const handleMBTI = (selectedOption) => {
  setMBTI(selectedOption.value);
 };

const [search] = useSearchParams();
 const id = search.get("id");
 console.log("Your id is: ", id)
 const navigate = useNavigate();
  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nativeLanguage === '' || targetLanguage === '' || targetLanguageProficiency === '' || age === '' || profession === '') {
      setError(true);
    } else {
      setSubmitted(true);
      setError(false);
    }
    setError("");
    try{
      // for backend
      console.log('Sending create: ' + nativeLanguage + targetLanguage+ targetLanguageProficiency+ age+ gender+ profession+ hobby + mbti)
      let data = await handleProfileCreationAPI(id, nativeLanguage, targetLanguage, targetLanguageProficiency, age, gender, profession, hobby, mbti);
      console.log('Create done')

      if (data && data.errCode !== 0){
          setSubmitted(true);
          setErrMsg(data.message);
      }
      if (data && data.errCode === 0){
      // todo when login successfull!
      setSubmitted(true);
      console.log("Profile Creation Successful!")
      }
    } catch(error){
      if (error.response){
        if (error.response.data){
                setErrMsg(error.response.data.message)
                console.log(errMsg)
    }
  }
    }
    
  
    navigate({
        pathname: "/Dashboard",
        search: createSearchParams({
            id: id
        }).toString()
    });
  };
 
  // Showing success message
  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1> Updated</h1>
      </div>
    );
  };
 
  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>enter required fields</h1>
      </div>
    );
  };
 
  return (
    <div className="screen-Background">
      <div className="screen-Container">
      <div className="screen-Content">
        <div>
        <h1>Set Profile</h1>
        <h6>(* indicates required fields)</h6>
        </div>
      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>
 
      <form>
        <div className="d-grid gap-2">
        {/* Labels and inputs for form data */}

        <div className='form-group'>
        <label className="label">Native Language*</label>
        <Select options={NativeLanguage} onChange={handleNativeLanguage}/>
        </div>

        <div className='form-group'>
        <label className="label">Target Language*</label>
        <Select options={TargetLanguage} onChange={handleTargetLanguage}/>
        </div>

        <div className='form-group'>
        <label className="label">Level of Target Language*</label>
        <Select options={TargetLanguageProficiency} onChange={handleTargetLanguageProficiency}/>
        </div>

        <div className='form-group'>
        <label className="label">Age*</label>
        <input 
        placeholder ="Enter Age"
        onChange={handleAge} className="input"
        type="text" />
        </div>
      

        <div className='form-group'>
        <label className="label">Gender</label>
        <Select options={Gender} onChange={handleGender}/>
        </div>

        <div className='form-group'>
        <label className="label">Profession*</label>
        <Select options={Profession} onChange={handleProfession}/>
        </div>

        <div className='form-group'>
        <label className="label">Hobby</label>
        <Select options={Hobby} onChange={handleHobby}/>
        </div>

        <div className='form-group'>
        <label className="label">Personality Type</label>
        <Select options={MBTI} onChange={handleMBTI}/>
        </div>
        

        </div>
        <Button className="btn-Screen"  onClick={handleSubmit}>
          Create Profile
        </Button>
      </form>
      </div>
      </div>
    </div>
  );
    
}
export default CreateProfile;