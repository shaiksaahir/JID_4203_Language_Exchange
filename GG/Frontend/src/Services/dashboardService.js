import axios from '../Utils/axios';

const handleUserDashBoardApi = (id) => {
    return axios.post('/Dashboard', { id: id });
};

export { handleUserDashBoardApi };
