import axios from 'axios';
import { useAuthStore } from '@/store/authStore'; // Импортируем наш store

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Ключевая часть: Интерцептор (перехватчик) запросов ===
// Эта функция будет выполняться ПЕРЕД каждым запросом
apiClient.interceptors.request.use(
  (config) => {
    // Получаем токен из Zustand
    const token = useAuthStore.getState().token;

    // Если токен есть, добавляем его в заголовок Authorization
    if (token) {
      // Ваш бэкенд ожидает токен в формате "Bearer <token>"
      // (видно из src/middleware/checkJwt.ts)
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Интерцептор ответов (для обработки ошибок)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Глобальная обработка ошибок
    console.error('API Error:', error.response?.data || error.message);

    // Если ошибка 401 (Unauthorized), токен невалиден,
    // очищаем его и перезагружаем страницу (выкидываем на логин)
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login'; 
    }

    return Promise.reject(error);
  },
);

export default apiClient;