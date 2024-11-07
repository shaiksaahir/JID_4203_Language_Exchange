    import axios from '../Utils/axios';

    // findFriends and createFriends do not appear to be in use in current application; this service.js is 
    // only for getting user names right now
    const handleFindFriendsApi = (id) => {
        return axios.post('/findFriends', {id:id}) ;
    }

    const handleCreateFriendsApi = (id1, id2) => {
        return axios.post('/createFriends', {id1:id1,id2:id2 }) ;
    }
    export const handleGetAllUsersApi = async () => {
        try {
            // Convert filters object to a query string, e.g., "?name=John"
        // const queryParams = new URLSearchParams(filters).toString(); 
        
            // Send the request with query parameters if they exist
            const response = await axios.get(`/api/v1/user-names`); // Fetch all users with potential filters
        
            return response.data; // Axios automatically parses the JSON response
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Re-throw error to be handled in the calling function
        }
    };

     const handleGetUserPreferencesApi = () => {
        return axios.get('api/v1/user-preferences');
    }


    const handleGetUserNamesApi = () => {
        return axios.get('/api/v1/user-names'); // defines the API endpoint
    }
     const handleAddFriendApi = (userId1, userId2, userInfo) => {
        console.log("Adding friend:", {
          user_id_2: userId2,
          user_2_first_name: userInfo.firstName,
          user_2_last_name: userInfo.lastName
        });
        
        return axios.post('/api/addFriend', {
          user_id_2: userId2,
          user_2_first_name: userInfo.firstName,
          user_2_last_name: userInfo.lastName
        });
      };

    export {handleFindFriendsApi, handleAddFriendApi,handleCreateFriendsApi, handleGetUserNamesApi, handleGetUserPreferencesApi}