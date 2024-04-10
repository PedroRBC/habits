import axios from "axios";

export const useApi = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
