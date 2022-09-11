//import { Config } from "./config.js";
const SERVER_URL = "3306:3306/";
const BASE_URL = 'http://127.0.0.1:8000/api/v1/';

const fetchJson = async (callback) => {
  const response = await callback;
  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export async function getPicture(id) {
  const response = await axios.get('/frontend/getimg', {
    params: {
      "id": id,
    }
  },)
  return JSON.parse(response.data.proposal_list)
}

export async function getLevel(id) {
  const response = await axios.get('/frontend/getlvl', {
    params: {
      "id": id,
    }
  },)
  return JSON.parse(response.data)
}

export async function getLevels() {
  const response = await axios.get('/frontend/getlvls')
  return JSON.parse(response.data.proposal_list)
}

export const postVideo = (formData) =>
  fetchJson(
    fetch(`${Config.BASE_URL}videos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
      method: "POST",
      body: formData,
    })
  );

export async function getVideo(id) {
  const response = await axios.get('/frontend/getvid', {
    params: {
      "id": id,
    }
  },)
  console.log(JSON.parse(response.data))
}

export const getUserMe = () =>
  fetchJson(
    fetch(`${Config.BASE_URL}user/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
      method: "GET",
    })
  );

