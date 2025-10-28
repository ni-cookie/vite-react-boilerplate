import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import type { Customer, CustomerDto } from './types';

// Ключи для кэширования
const CUSTOMERS_QUERY_KEY = ['customers'];

// === 1. Функции для API-запросов ===
// (адаптированы под ваши эндпоинты: /v1/customers)

const getCustomers = async (): Promise<Customer[]> => {
  // Ваш бэкенд возвращает { data: [...] }
  const response = await apiClient.get('/customers');
  return response.data; // Достаем массив из data
};

const getCustomerById = async (id: number): Promise<Customer> => {
  // Ваш бэкенд возвращает { data: {...} }
  const response = await apiClient.get(`/customers/${id}`);
  return response.data;
};

const createCustomer = async (newCustomer: CustomerDto): Promise<Customer> => {
  const response = await apiClient.post('/customers', newCustomer);
  return response.data;
};

// Partial<CustomerDto> - значит, что можно обновлять не все поля сразу
const updateCustomer = async ({ id, data }: { id: number; data: Partial<CustomerDto> }): Promise<Customer> => {
  const response = await apiClient.put(`/customers/${id}`, data);
  return response.data;
};

const deleteCustomer = async (id: number): Promise<void> => {
  await apiClient.delete(`/customers/${id}`);
};

// === 2. Хуки для использования в компонентах ===

// Хук для получения списка всех "customers"
export const useCustomers = () =>
  useQuery<Customer[]>({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: getCustomers,
  });

// Хук для получения одного "customer" по ID
export const useCustomer = (id: number) =>
  useQuery<Customer>({
    queryKey: [...CUSTOMERS_QUERY_KEY, id], // Ключ: ['customers', 1]
    queryFn: () => getCustomerById(id),
    enabled: !!id, // Запрос выполнится только если id существует
  });

// Хук-мутация для СОЗДАНИЯ
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      // При успехе - инвалидируем (обновляем) кэш списка
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      // и переходим на страницу списка
      navigate({ to: '/customers' });
    },
    onError: (error) => {
      alert(`Creation failed: ${error.message}`);
    },
  });
};

// Хук-мутация для ОБНОВЛЕНИЯ
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (updatedCustomer) => {
      // Обновляем кэш списка
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      // Также можно вручную обновить кэш конкретного элемента
      queryClient.setQueryData(
        [...CUSTOMERS_QUERY_KEY, updatedCustomer.id],
        updatedCustomer,
      );
      navigate({ to: '/customers' });
    },
    onError: (error) => {
      alert(`Update failed: ${error.message}`);
    },
  });
};

// Хук-мутация для УДАЛЕНИЯ
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      // При успехе - инвалидируем кэш списка
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (error) => {
      alert(`Deletion failed: ${error.message}`);
    },
  });
};