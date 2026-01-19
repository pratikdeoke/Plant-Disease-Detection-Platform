import axios from "axios";

const API = "http://localhost:4000/api/v1/discussions";

export const getPosts = () => {
  return axios.get(`${API}/posts`);
};

export const getPost = (id) => {
  return axios.get(`${API}/posts/${id}`);
};

export const createPost = (token, data) => {
  return axios.post(`${API}/posts`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addComment = (token, postId, data) => {
  return axios.post(`${API}/posts/${postId}/comments`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
