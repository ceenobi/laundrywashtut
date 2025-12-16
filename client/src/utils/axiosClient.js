import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;

const config = {
  baseURL: BASEURL + "/api/v1",
  withCredentials: true, //allows cookies sent from server to be saved on client
};

const axiosClient = axios.create(config);

export default axiosClient;
