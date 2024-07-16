import axios from '../Utils/axios';

const handleFindFriendsApi = (id) => {
    return axios.post('/findFriends', {id:id}) ;
}

const handleCreateFriendsApi = (id1, id2) => {
    return axios.post('/createFriends', {id1:id1,id2:id2 }) ;
}





export {handleFindFriendsApi, handleCreateFriendsApi}