// src/Axios/apiCall.ts
import axios, { AxiosRequestConfig, Method } from "axios";

/* ========= Axios instancija ========= */
const BASE_URL = "http://localhost:5190";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ========= Bendras helperis ========= */
type Operation = "get" | "add" | "update" | "delete";

export const apiCall = async <T = any>(
  operation: Operation,
  endpoint: string,
  id: string | number = "",
  data: unknown = null
): Promise<T> => {
  /* URL + HTTP metodas pagal operaciją */
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

  /* Axios konfigūracija */
  const config: AxiosRequestConfig = {
    url,
    method,
    ...(data !== null ? { data } : {}),
  };

  const response = await api.request<T>(config);
  return response.data;
};

/* ❌  Nebedubliuojame specifinių metodų čia – jie perkeliami į apiServises.ts */
