import axios from '../Utils/axios';

const handleFindFriendsApi = (id) => {
    return axios.post('/findFriends', {id: id});
};

const handleCreateFriendsApi = (id1, id2) => {
    return axios.post('/createFriends', {id1: id1, id2: id2});
};

export const handleGetAllUsersApi = async () => {
    try {
        const response = await axios.get('/api/v1/user-names'); // Fetch all users
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const handleGetUserPreferencesApi = () => {
    return axios.get('/api/v1/user-preferences');
};

const handleGetUserNamesApi = () => {
    return axios.get('/api/v1/user-names'); // Fetch all user names
};

const handleAddFriendApi = (userId1, userId2, userInfo) => {
    return axios.post('/api/addFriend', {
        user_id_2: userId2,
        user_2_first_name: userInfo.firstName,
        user_2_last_name: userInfo.lastName
    });
};

// New function to fetch an individual user profile by ID
const handleGetUserProfileApi = (userId) => {
    return axios.get(`/api/v1/getUserProfile/${userId}`);
};

export {
    handleFindFriendsApi,
    handleAddFriendApi,
    handleCreateFriendsApi,
    handleGetUserNamesApi,
    handleGetUserPreferencesApi,
    handleGetUserProfileApi // Export the new function
};