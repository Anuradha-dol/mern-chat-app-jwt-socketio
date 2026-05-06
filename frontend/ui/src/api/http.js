import axios from "axios";
import { API_BASE_URL } from "../constants/config";

// Shared axios client so every request has the same base URL and cookie setup.
const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default http;
