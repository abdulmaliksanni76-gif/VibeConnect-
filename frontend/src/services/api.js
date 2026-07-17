// import axios from 'axios';

// const API = axios.create({ 
//   baseURL: import.meta.env.MODE === 'production' 
//     ? "/api" 
//     : "http://localhost:5000/api" 
// });

// export const registerUser = (formData) => API.post('/auth/register', formData);

// export default API;

import axios from "axios";

const API = axios.create({

    baseURL:
        import.meta.env.MODE === "production"
            ? "/api"
            : "http://localhost:5000/api",

    timeout:10000,

});

API.interceptors.request.use(

    (config)=>{

        const token=localStorage.getItem("token");

        if(token){

            config.headers.Authorization=`Bearer ${token}`;

        }

        return config;

    },

    (error)=>Promise.reject(error)

);

API.interceptors.response.use(

    (response)=>response,

    (error)=>{

        if(error.response?.status===401){

            console.log("Unauthorized");

            // Later we'll automatically log the user out here
            // when the token expires.

        }

        return Promise.reject(error);

    }

);

export const registerUser=(formData)=>
    API.post("/auth/register",formData);

export default API;