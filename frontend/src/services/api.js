import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mypt-wrmf.onrender.com/',
});

export default api;