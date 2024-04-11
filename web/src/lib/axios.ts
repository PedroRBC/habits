import axios from "axios";
import { getCookie } from "cookies-next";

export const useApi = () => {
  const token = getCookie("token");

  return axios.create({
    baseURL: "/api/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
