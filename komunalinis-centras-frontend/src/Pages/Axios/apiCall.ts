import axios, { AxiosRequestConfig, Method } from "axios";

const BASE_URL = "http://localhost:5190";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type Operation = "get" | "add" | "update" | "delete";

export const apiCall = async <T = any>(
  operation: Operation,
  endpoint: string,
  id: string | number = "",
  data: unknown = null
): Promise<T> => {
  let method: Method = "get";
  let url = `/${endpoint}`;

  switch (operation) {
    case "get":
      if (id) url += `/${id}`;
      method = "get";
      break;
    case "add":
      method = "post";
      break;
    case "update":
      if (id) url += `/${id}`;
      method = "put";
      break;
    case "delete":
      if (id) url += `/${id}`;
      method = "delete";
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  const config: AxiosRequestConfig = {
    url,
    method,
    ...(data !== null ? { data } : {}),
  };

  const response = await api.request<T>(config);
  return response.data;
};

