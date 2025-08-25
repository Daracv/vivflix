import axios from "axios";

const BASE_URL = "https://vivflix.azurewebsites.net/api";

// --- Public Axios Instance ---
const publicApi = axios.create({
  baseURL: BASE_URL,
});

// --- Private Axios Instance ---
const privateApi = axios.create({
  baseURL: BASE_URL,
});

// Attach token to all private requests
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// --- AUTH APIs ---
//
// Sign Up
export const signup = async (userData) => {
  const res = await publicApi.post("/auth/signup", userData);
  return res.data;
};

// Login
export const login = async ({ username, password }) => {
  const res = await publicApi.post("/auth/login", {
    username,
    password,
  });

  const { token, user } = res.data;

  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

// Get Profile
export const getProfile = async () => {
  const res = await privateApi.get("/auth/profile");
  return res.data;
};

// Log Out
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

//
// --- VIDEO APIs ---
//
// Upload Video
export const uploadVideo = async (formData) => {
  const res = await privateApi.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get Video
export const getVideos = async (search = "") => {
  const res = await publicApi.get("/videos", {
    params: { search },
  });
  return res.data;
};

// Get Video By ID
export const getVideoById = async (id) => {
  const res = await publicApi.get(`/videos/${id}`);
  return res.data;
};

//
// --- COMMENT APIs ---
//
// Post Comment
export const postComment = async (videoId, commentData) => {
  const res = await privateApi.post(`/comments/${videoId}`, commentData);
  return res.data;
};

//
// --- Rating APIs ---
//
export const postRating = async (videoId, data) => {
  const res = await privateApi.post(`/ratings/${videoId}`, data);
  return res.data;
};

// Get videos uploaded by a specific creator
export const getVideosByCreator = async () => {
  const res = await privateApi.get(`/videos/creator`);
  return res.data;
};

// Get videos a consumer has rated or commented on
export const getVideosByUserActivity = async () => {
  const res = await privateApi.get(`/videos/user-activity`);
  return res.data;
};
