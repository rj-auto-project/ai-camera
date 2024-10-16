const getAccessLevel = (role) => {
  const userData = localStorage.getItem("authData");
  if (userData) {
    const { accessLevel } = JSON.parse(userData);
    return accessLevel === role;
  }
};

export default getAccessLevel;
