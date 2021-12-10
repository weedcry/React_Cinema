import axios from 'axios';

const endpoint = "https://api-cinemas.herokuapp.com"

export function get(url) {
    return axios.get(endpoint +url,{
        headers: {Authorization: `Bearer_${localStorage.getItem('token')}`},
    });
}

export function put(url,body) {
    return axios.put(endpoint + url ,body,{
        headers: {Authorization: `Bearer_${localStorage.getItem('token')}`},
    });
}

export function post(url,body) {
    return axios.post(endpoint+url,body,{
        headers: {Authorization: `Bearer_${localStorage.getItem('token')}`},
    });
}

export function del(url) {
    return axios.delete(endpoint+url,{
        headers: {Authorization: `Bearer_${localStorage.getItem('token')}`},
    });
}

export function uploadImage(url,file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(endpoint+url,formData,{
        headers: {
            Authorization: `Bearer_${localStorage.getItem('token')}`,
            'Content-type': 'multipart/form-data'
        },
    });
}
