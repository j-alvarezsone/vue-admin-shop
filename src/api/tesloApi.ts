import { env } from "@/lib/utils/env";
import axios from "axios";

const tesloApi = axios.create({
  baseURL: env.VITE_TESLO_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

tesloApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { tesloApi };
