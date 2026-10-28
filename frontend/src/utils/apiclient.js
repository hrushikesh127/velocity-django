import axios from 'axios'

const apiclient = axios.create({
    baseURL:'http://127.0.0.1:8000/api/'
})

export default apiclient;


export function settoken(token){
    if(token){
        apiclient.defaults.headers.common['Authorization'] =`Bearer ${token}`;
    }else{
        delete apiclient.defaults.headers.common['Authorization']
    }
}
