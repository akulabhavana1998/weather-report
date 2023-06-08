import axios from 'axios';

const key = '703361b08b054638822140842230506';

function getWeather(city) {
    let url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;
    return axios.get(url)
        .then(res => res.data);
}

function getAuthToken(userMail, apiKey) {
    let url = 'https://www.universal-tutorial.com/api/getaccesstoken';
    let headers = {
        'api-token': apiKey,
        'user-email': userMail
    };
    return axios.get(url, {headers})
        .then(res => res.data);
}

function getStates(authToken) {
    let url = 'https://www.universal-tutorial.com/api/states/India';
    let headers = {
        Authorization: `Bearer ${authToken}`
    };
    return axios.get(url, {headers})
        .then(res => res.data);
}

function getCities(state, authToken) {
    let url = 'https://www.universal-tutorial.com/api/cities/' + state;
    let headers = {
        Authorization: `Bearer ${authToken}`
    };
    return axios.get(url, {headers})
        .then(res => res.data);
}

export default {
    getWeather,
    getAuthToken,
    getStates,
    getCities
}