import Ls from "./ls";
import axios from "axios";
import { apiUrl } from "../constants/config";

export default {
  async login(loginData) {
    try {
      let response = await axios.post(
        "https://afternoon-citadel-52453.herokuapp.com/login",
        {
          //let response = await axios.post('http://localhost:3000/login', {
          user: loginData.email,
          password: loginData.password
        }
      );
      Ls.set("auth.token", response.data.token);
      return response.data.token;
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  },

  async logout() {
    try {
      //await axios.get('https://afternoon-citadel-52453.herokuapp.com/logout')

      Ls.remove("auth.token");
      return "Sesión finalizada";
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  /* async check() {
    let response = await axios.get('/check')

    return !!response.data.authenticated
  } */
};
