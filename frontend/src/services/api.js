// import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export const registerUser = (formData) => API.post('/auth/register', formData);

import axios from 'axios';

// This checks if the app is in production; if not, it uses localhost
// const API_BASE_URL = import.meta.env.MODE === 'production' 
//   ? "https://vibeconnect-1-f4m7.onrender.com/api" 
//   : "http://localhost:5000/api";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const API = axios.create({ baseURL: `${BASE_URL}/api` });

export const registerUser = (formData) => API.post('/auth/register', formData);

export default API;