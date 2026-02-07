import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5275/api", // your backend URL
});

export default API;
