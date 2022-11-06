import Axios from 'axios';
const proxy = ""; //"https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://api.expoinnova.jegsnet.com/api/v1/"
const AppUtil = {

  postAPI:async function postAPI(endpoint, dataPost, token = '')
  {
    try {

      let response = await Axios.post(`${endpoint}`, dataPost, {

        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
  deleteAPI:async function deleteAPI(endpoint, token = '')
  {
    try {

      let response = await Axios.delete(`${endpoint}`, {

        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
      let response = await Axios.get(`${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
        }

      });
      console.log(response);
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
  }/*
  isEmail: function isEmail(email)
  {
    var emailformat = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
    return emailformat.test(email);
  }*/
}



export default AppUtil;
