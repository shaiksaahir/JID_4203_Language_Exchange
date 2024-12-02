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
  const [visibility, setVisibility] = useState('');
  const [datesAvailable, setDatesAvailable] = useState('');
  const [timesAvailable, setTimesAvailable] = useState('');
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
  {value: "INTJ", label: "INTJ"},
  {value: "INTP", label: "INTP"},
  {value: "ENTJ", label: "ENTJ"},
  {value: "ENTP", label: "ENTP"},
  {value: "INFJ", label: "INFJ"},
  {value: "INFP", label: "INFP"},
  {value: "ENFJ", label: "ENFJ"},
  {value: "ENFP", label: "ENFP"},
  {value: "ISTJ", label: "ISTJ"},
  {value: "ISFJ", label: "ISFJ"},
  {value: "ESTJ", label: "ESTJ"},
  {value: "ESFJ", label: "ESFJ"},
  {value: "ISTP", label: "ISTP"},
  {value: "ISFP", label: "ISFP"},
  {value: "ESTP", label: "ESTP"},
  {value: "ESFP", label: "ESFP"},
 ]

 const VisibilityOptions = [
  { value: "Show", label: "Show" },
  { value: "Hide", label: "Hide" },
 ];

const DatesAvailable = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const TimesAvailable = [
  { value: "12AM - 1AM", label: "12AM - 1AM" },
  { value: "1AM - 2AM", label: "1AM - 2AM" },
  { value: "2AM - 3AM", label: "2AM - 3AM" },
  { value: "3AM - 4AM", label: "3AM - 4AM" },
  { value: "4AM - 5AM", label: "4AM - 5AM" },
  { value: "5AM - 6AM", label: "5AM - 6AM" },
  { value: "6AM - 7AM", label: "6AM - 7AM" },
  { value: "7AM - 8AM", label: "7AM - 8AM" },
  { value: "8AM - 9AM", label: "8AM - 9AM" },
  { value: "9AM - 10AM", label: "9AM - 10AM" },
  { value: "10AM - 11AM", label: "10AM - 11AM" },
  { value: "11AM - 12PM", label: "11AM - 12PM" },
  { value: "12PM - 1PM", label: "12PM - 1PM" },
  { value: "1PM - 2PM", label: "1PM - 2PM" },
  { value: "2PM - 3PM", label: "2PM - 3PM" },
  { value: "3PM - 4PM", label: "3PM - 4PM" },
  { value: "4PM - 5PM", label: "4PM - 5PM" },
  { value: "5PM - 6PM", label: "5PM - 6PM" },
  { value: "6PM - 7PM", label: "6PM - 7PM" },
  { value: "7PM - 8PM", label: "7PM - 8PM" },
  { value: "8PM - 9PM", label: "8PM - 9PM" },
  { value: "9PM - 10PM", label: "9PM - 10PM" },
  { value: "10PM - 11PM", label: "10PM - 11PM" },
  { value: "11PM - 12AM", label: "11PM - 12AM" },
];

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

 const handleVisibility = (selectedOption) => {
  setVisibility(selectedOption.value)
 };

const handleDatesAvailable = (selectedOptions) => {
  const values = selectedOptions.map(option => option.value);
  setDatesAvailable(values);

};
const handleTimesAvailable = (selectedOptions) => {
  const values = selectedOptions.map(option => option.value);
  setTimesAvailable(values);

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
        console.log('Sending create: ' + nativeLanguage + targetLanguage + targetLanguageProficiency + age + gender + profession + hobby + mbti + datesAvailable + timesAvailable + visibility);
      let data = await handleProfileCreationAPI(id, nativeLanguage, targetLanguage, targetLanguageProficiency, age, gender, profession, hobby, mbti, "" + datesAvailable, "" + timesAvailable, visibility);
      console.log('Create done')
      console.log(datesAvailable);
      console.log(timesAvailable);

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

  const handleBack = async (e) => {
    navigate({
      pathname: "/Dashboard",
      search: createSearchParams({
        id: id
      }).toString()
    });
  };
 
  return (
    <div className="screen-Background">
      <div className="screen-Container" style={{ justifyContent: 'center' }}>
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
        <div className="profile-container">
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

        <div className='form-group'>
        <label className="label">Date Availability</label>
        <Select options={DatesAvailable} isMulti onChange={handleDatesAvailable}/>
        </div>

        <div className='form-group'>
        <label className="label">Time Availability</label>
        <Select options={TimesAvailable} isMulti onChange={handleTimesAvailable}/>
        </div>

        <div className='form-group'>
          <label className="label">Visibility</label>
          <Select options={VisibilityOptions} onChange={handleVisibility} />
        </div>
        

        </div>
        <button className="btn-back-02"  onClick={handleSubmit}>
          Update Profile
        </button>
      </form>
      </div>
      <div>
        <button className="btn-back-02" onClick={handleBack}>Back</button>
      </div>
      </div>
    </div>
  );
    
}
export default CreateProfile;