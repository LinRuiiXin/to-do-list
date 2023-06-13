import axios from "axios";
import store from "@/main";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    timeout: 3000,
    withCredentials: true
});

api.interceptors.response.use(
    response => {
        if(response.status === 200) {
            if(response.data.code === 200) return response.data
            else if(response.data.code === 505) {
                store.state.user = null
                return Promise.reject({code: response.data.code, message: response.data.message})
            } else return Promise.reject(response.data);
        } else return Promise.reject({code: response.status, message: response.statusText})
    }, error => {
        return Promise.reject({code: 500, message: error})
    })

export default api;