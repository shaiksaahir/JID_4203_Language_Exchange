// src/Utils/userData.js

// Object to store user data
let userData = {};

// Function to set all user data
export const setUserData = (data) => {
    userData = data;
};

// Function to get all user data
export const getUserData = () => {
    return userData;
};

// Individual setters for specific attributes (if needed for updates)
export const setFirstName = (firstName) => {
    userData.firstName = firstName;
};

export const setLastName = (lastName) => {
    userData.lastName = lastName;
};

export const setEmail = (email) => {
    userData.email = email;
};

export const setAge = (age) => {
    userData.age = age;
};

export const setGender = (gender) => {
    userData.gender = gender;
};

export const setHobby = (hobby) => {
    userData.hobby = hobby;
};

export const setProfession = (profession) => {
    userData.profession = profession;
};

// Individual getters for specific attributes
export const getFirstName = () => {
    return userData.firstName;
};

export const getLastName = () => {
    return userData.lastName;
};

export const getEmail = () => {
    return userData.email;
};

export const getAge = () => {
    return userData.age;
};

export const getGender = () => {
    return userData.gender;
};

export const getHobby = () => {
    return userData.hobby;
};

export const getProfession = () => {
    return userData.profession;
};