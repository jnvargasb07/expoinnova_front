import Axios from 'axios';
const proxy = ""; //"https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://api-expoinnova.jegsnet.com/api/v1/" //"https://pxdev1.com/mamiferos-acuaticos/wp-json/v1/";

const AppUtil = {

  postAPI:async function postAPI(endpoint, dataPost)
  {
    try {

      let response = await Axios.post(`${proxy}${apiUrl}${endpoint}`, dataPost, {

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      let dataRet = response.data;
      return dataRet;
    }
    catch (e)
    {
      console.error(e.message);
      return false;
    }
  },
  getAPI: async function getAPI(endpoint, token = '')
  {
    try {

      let response = await Axios.get(`${proxy}${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }

      });
      let dataRet = response.data;
      return dataRet;
    }
    catch (e)
    {
      console.error(e);
      return false;
    }
  },
  isJson: function isJson(data)
  {
      try
      {
        let dataReturn = JSON.parse(data);
        return dataReturn;
      } catch (e)
      {
        console.error(e);
        return false;
      }
  },
  isEmail: function isEmail(email)
  {
    var emailformat = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
    return emailformat.test(email);
  }
}



export default AppUtil;
