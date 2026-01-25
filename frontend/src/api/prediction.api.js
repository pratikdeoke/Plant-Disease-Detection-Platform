import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const predictImage = (token, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return axios.post(`${API}/predictions`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getMyPredictions = (token) =>
  axios.get(`${API}/predictions/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
