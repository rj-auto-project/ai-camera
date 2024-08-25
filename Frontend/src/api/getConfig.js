export const config = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};