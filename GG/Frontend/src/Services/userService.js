import axios from '../Utils/axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', {email: userEmail, password: userPassword}) ;
}

const handleUserLogout = (id) => {
    return axios.post('/api/logout', {id: id})
}

const handleRegisterApi= (firstName, lastName, Email, userPassword) => {
    return axios.post('/Register', {firstName: firstName, lastName: lastName, email: Email, password: userPassword}) ;
}

const handleProfileCreationAPI = (id, native_language, target_language, target_language_proficiency, age, gender, profession, hobby, mbti, dates_available, times_available, visibility) => {
    return axios.post('/CreateProfile', {id: id, native_language: native_language, target_language: target_language, target_language_proficiency: target_language_proficiency, age: age, gender: gender, profession: profession, hobby: hobby, mbti: mbti, dates_available: dates_available, times_available: times_available, visibility: visibility}) ;
}
//return
const handleChatApi = (senderId) => {
    return axios.get(`/Chats/${senderId}`)
}

const handleGetUser = (receiverId) => {
    return axios.get(`/api/getUser/${receiverId}`)
}

const getMessages = (chatId) => {
    return axios.get(`/Message/${chatId}`)
}

const addMessage = (data) => {
    return axios.post(`/Message/`, data)
}

const handleTranslator = (en, ko) => {
    return axios.post('/Translator', {en: en, ko: ko});
}

const handleMatch = (userId, userNative, userTarget) => {
    return axios.get(`/api/findMatch/${userId}/${userNative}/${userTarget}`)
}

const handleGetProfile = (receiverId) => {
    return axios.get(`/api/getProfile/${receiverId}`)
}

const handleDataPopulation = () => {
    return axios.get(`/populateData`)
}

const handleUpdateRating = (userId, rating) => {
    return axios.post('/api/v1/update-rating', {
        user_id: userId,
        rating: rating
    });
};



export {handleLoginApi, handleRegisterApi, handleProfileCreationAPI, handleChatApi, handleGetUser, getMessages, addMessage, handleTranslator, handleMatch, handleGetProfile, handleDataPopulation, handleUserLogout, handleUpdateRating}