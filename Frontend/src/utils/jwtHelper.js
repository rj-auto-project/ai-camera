// src/utils/jwtHelper.js

export const getToken = () => {
  return localStorage.getItem("token"); // Assuming you store JWT in localStorage
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isTokenExpired = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    console.log("DECODE TOEN", decodedToken);
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};
