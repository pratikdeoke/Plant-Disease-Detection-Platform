import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getPosts = () => {
  return axios.get(`${API}/discussions/posts`);
};

export const getPost = (id) => {
  return axios.get(`${API}/discussions/posts/${id}`);
};

export const createPost = (token, data) => {
  return axios.post(`${API}/discussions/posts`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addComment = (token, postId, data) => {
  return axios.post(`${API}/discussions/posts/${postId}/comments`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
