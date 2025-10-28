// src/features/orders/types.ts

// Припускаємо, що API повертає повні об'єкти
// (на основі OrderResponseDTO.ts та CustomerResponseDTO.ts)
interface BaseCustomer {
  id: number;
  name: string;
  email: string;
  //... можете додати інші поля, якщо вони є
}

interface BaseFlower {
  id: number;
  name: string;
  //... можете додати інші поля
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

// Тип для замовлення, яке ми отримуємо від API
export interface Order {
  id: number;
  quantity: number;
  price: number;
  order_date: string; // ISO-рядок (YYYY-MM-DD)
  status: OrderStatus;
  customer: BaseCustomer;
  flower: BaseFlower;
}

// Тип для форми (створення/оновлення)
// Ми відправляємо ID, а не цілі об'єкти
export interface OrderDto {
  customer_id: number;
  flower_id: number;
  quantity: number;
  price: number;
  order_date: string; // YYYY-MM-DD
  status: OrderStatus;
}