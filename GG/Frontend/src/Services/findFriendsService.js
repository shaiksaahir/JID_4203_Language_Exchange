import axios from '../Utils/axios';

// findFriends and createFriends do not appear to be in use in current application; this service.js is 
// only for getting user names right now
const handleFindFriendsApi = (id) => {
    return axios.post('/findFriends', {id:id}) ;
}

const handleCreateFriendsApi = (id1, id2) => {
    return axios.post('/createFriends', {id1:id1,id2:id2 }) ;
}



const handleGetUserNamesApi = () => {
    return axios.get('/api/v1/user-names'); // defines the API endpoint
}

export {handleFindFriendsApi, handleCreateFriendsApi, handleGetUserNamesApi}