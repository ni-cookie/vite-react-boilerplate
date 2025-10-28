// src/features/orders/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import type { Order, OrderDto } from './types';

// Ключі для кэшування
const ORDERS_QUERY_KEY = ['orders'];

// === 1. Функції для API-запитів ===

const getOrders = async (): Promise<Order[]> => {
  // Базуючись на нашому досвіді з "customers":
  const response = await apiClient.get('/orders');
  return response.data; // Очікуємо { data: { orders: [...] } }
};

const getOrderById = async (id: number): Promise<Order> => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data; // Очікуємо { data: { order: {...} } }
};

const createOrder = async (newOrder: OrderDto): Promise<Order> => {
  const response = await apiClient.post('/orders', newOrder);
  return response.data; // Очікуємо { data: {...} }
};

const updateOrder = async ({ id, data }: { id: number; data: Partial<OrderDto> }): Promise<Order> => {
  const response = await apiClient.put(`/orders/${id}`, data);
  return response.data; // Очікуємо { data: {...} }
};

const deleteOrder = async (id: number): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};

// === 2. Хуки для використання в компонентах ===

export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getOrders,
  });

export const useOrder = (id: number) =>
  useQuery<Order>({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      navigate({ to: '/orders' });
    },
    onError: (error) => {
      console.error('Create order failed:', error);
      alert(`Creation failed: ${error.message}`);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      // Оновлюємо кэш для конкретного замовлення
      queryClient.setQueryData(
        [...ORDERS_QUERY_KEY, updatedOrder.id],
        updatedOrder,
      );
      navigate({ to: '/orders' });
    },
    onError: (error) => {
      console.error('Update order failed:', error);
      alert(`Update failed: ${error.message}`);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (error) => {
      alert(`Deletion failed: ${error.message}`);
    },
  });
};