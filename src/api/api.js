import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

const token = "701012sm01761073247";

// request interceptor
api.interceptors.request.use((config)=>{
    // console.log(config);
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
},
 (error)=>{
    return Promise.reject(error)
 })

// response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        if (err.response) {
            // error came from server
            err.message = `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`;
        }

        return Promise.reject(err);
    }
);

export default api;