import axios from "axios";

const baseUrl = 'http://localhost:3000/api';


export const spotifyProxy = (url: string) => {
    return axios.get(`${baseUrl}/spotify/proxy?query=${url}`);
}

export const spotifySearch = (searchQ: string) => {
    return axios.get(`${baseUrl}/spotify/search?query=${searchQ}`);
}