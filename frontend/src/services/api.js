   // services/api.js
   import axios from "axios";
   import { getAccessToken } from "./auth";
   import jwtDecode from "jwt-decode"; // Certifique-se de que a importação está correta

   const api = axios.create({
     baseURL: "http://localhost:8000/api/v1/",
     headers: {
       "Content-Type": "application/json",
     },
   });

   // Interceptor para adicionar o token às requisições
   api.interceptors.request.use((config) => {
     const token = getAccessToken();
     if (token) {
       const decoded = jwtDecode(token);
       // Verifica se o token expirou
       if (decoded.exp * 1000 < Date.now()) {
         window.location.href = "/login"; // Redireciona para login se expirado
         return Promise.reject(new Error("Token expired"));
       }
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   // Interceptor para tratar erros 401
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         window.location.href = "/login"; // Redireciona para login
       }
       return Promise.reject(error);
     }
   );

   export default api;
