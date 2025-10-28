import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore'; // Наш store

// Тип данных, которые ожидает ваш бэкенд (src/controllers/auth/login.ts)
interface LoginPayload {
  email: string;
  password: string;
}

// Тип ответа от вашего бэкенда
interface LoginResponse {
  message: string;
  data: string; // Это строка "Bearer eyJ..."
}

// Функция API-запроса
const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};

// Хук-мутация для использования в компоненте
export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore(); // Функция для сохранения токена

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Ваш бэкенд возвращает "Bearer <token>"
      // Нам нужно извлечь сам токен
      const token = data.data.split(' ')[1]; 

      setToken(token); // Сохраняем токен в Zustand

      // Перенаправляем на главную страницу (или на /customers)
      navigate({ to: '/home' });
    },
    onError: (error) => {
      // Здесь можно показать toast-уведомление об ошибке
      console.error('Login failed:', error);
      alert('Login failed. Check console.');
    },
  });
};