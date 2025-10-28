# Лабораторна робота №8-9: Full-stack Інтеграція (CRUD)
# Виконав: Лапін Микита ІПЗ-3.03

## 1. Мета роботи

Мета цієї роботи — розробка повноцінного клієнтського додатку (frontend) для раніше створеного REST API (backend). Проєкт побудований на базі професійного бойлерплейту `vite-react-boilerplate` і демонструє повний цикл роботи з даними.

У рамках роботи реалізовано повний **CRUD** (Create, Read, Update, Delete) функціонал для двох сутностей:
1.  **Customers** (Клієнти)
2.  **Orders** (Замовлення)

Також реалізовано систему автентифікації зі сторінкою логіну та керуванням JWT-токенами.

## 2. 🚀 Основний реалізований функціонал

* **Автентифікація:**
    * Сторінка логіну (`/login`).
    * Збереження JWT-токену в глобальному сховищі **Zustand** після успішного входу.
    * Автоматичне додавання `Bearer` токену до всіх API-запитів за допомогою **Axios Interceptors**.
    * Автоматичне перенаправлення на `/login` при помилці `401 Unauthorized`.
* **CRUD для "Customers":**
    * Читання та відображення списку клієнтів (`/customers`).
    * Створення нового клієнта (`/customers/new`) з валідацією форми.
    * Редагування існуючого клієнта (`/customers/:id`) із завантаженням даних та валідацією.
    * Видалення клієнта зі списку з підтвердженням.
* **CRUD для "Orders":**
    * Читання та відображення списку замовлень (`/orders`).
    * Створення нового замовлення (`/orders/new`).
    * Редагування замовлення (`/orders/:id`), включаючи коректне форматування та обробку дат.
    * Видалення замовлення.
* **Валідація форм:**
    * Використання **Zod** для суворої валідації даних на стороні клієнта.
    * Схеми Zod повністю синхронізовані з правилами валідації на бэкенді (формат телефону, дати, обов'язкові поля).
* **Керування станом:**
    * Використання **TanStack Query** для всього серверного стану: запити (GET), мутації (POST, PUT, DELETE), кешування та автоматична інвалідація кешу після змін.
* **Маршрутизація:**
    * Використання файлової системи **TanStack Router** для організації сторінок (включаючи вкладені маршрути `index.tsx`, `new.tsx`, `$id.tsx`).

## 3. 🔧 Технологічний стек

* **Основа:** React 18, TypeScript, Vite
* **Маршрутизація:** TanStack Router
* **Серверний стан:** TanStack Query (React Query)
* **Форми:** React Hook Form
* **Валідація:** Zod
* **Глобальний стан:** Zustand (для JWT-токену)
* **HTTP-клієнт:** Axios
* **Стилізація:** Tailwind CSS

## 4. ⚙️ Запуск проєкту

1.  Клонуйте репозиторій.
2.  Встановіть залежності:
    ```bash
    pnpm install
    ```
3.  Створіть файл `.env` у корені проєкту та додайте URL вашого бэкенду:
    ```.env
    VITE_API_BASE_URL="http://localhost:4000/v1"
    ```
4.  Переконайтеся, що ваш бэкенд-сервер запущений на `http://localhost:4000`.
5.  Запустіть dev-сервер фронтенду:
    ```bash
    pnpm run dev
    ```
6.  Відкрийте `http://localhost:5173` у вашому браузері.

## 5. 🎨 Ключові фрагменти коду

### 1. Налаштування Axios з Interceptor (src/lib/axios.ts)

Цей файл автоматично додає JWT-токен (який зберігається в Zustand) до кожного запиту.

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/authStore'; // Імпортуємо наш store

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Інтерцептор запитів: додаємо токен
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Інтерцептор відповідей: обробка 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### 2. Схема валідації Zod (src/features/customers/schema.ts)

Приклад схеми Zod, яка синхронізована з валідацією бэкенду (формат телефону, очищення від пробілів).

```typescript
import { z } from 'zod';

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .trim(), // Очищення від пробілів

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')), 

  phone: z
    .string()
    .trim() // Очищення від пробілів
    .regex(
      new RegExp(/^\+380\d{9}$/), // Суворе правило для формату телефону
      'Phone must be in the format +380XXXXXXXXX',
    ),
  
  address: z
    .string()
    .min(1, 'Address is required') 
    .trim(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
```

### 3. API-хуки TanStack Query (src/features/orders/api.ts)

Приклад використання `useQuery` для отримання списку та `useMutation` для оновлення даних.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import type { Order, OrderDto } from './types';

const ORDERS_QUERY_KEY = ['orders'];

// ... (інші функції get, create, delete) ...

const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders');
  return response.data.data.orders;
};

const updateOrder = async ({ id, data }: { id: number; data: Partial<OrderDto> }): Promise<Order> => {
  const response = await apiClient.put(`/orders/${id}`, data);
  return response.data.data;
};


// Хук для отримання списку
export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getOrders,
  });

// Хук-мутація для оновлення
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (updatedOrder) => {
      // Інвалідація списку
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      // Оновлення кешу для конкретного елемента
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
```

## 6. 📸 Демонстрація роботи (Скріншоти)

### 1. Автентифікація

**Скріншот 1.1: Сторінка Логіну (`/login`)**
![image0](images/image0.png)

**Скріншот 1.2: Помилки валідації Zod на сторінці логіну**
![image1](images/image1.png)

**Скріншот 1.3: Вкладка "Network" після успішного логіну**
![image2](images/image2.png)
![image3](images/image3.png)

### 2. CRUD "Customers"

**Скріншот 2.1: Сторінка списку клієнтів (`/customers`)**
![image4](images/image4.png)
![image5](images/image5.png)

**Скріншот 2.2: Сторінка створення (`/customers/new`) з помилками валідації**
![image6](images/image6.png)

**Скріншот 2.3: Сторінка редагування (`/customers/:id`)**
![image7](images/image7.png)
![image8](images/image8.png)

**Скріншот 2.4: Вкладка "Network" при видаленні клієнта**
![image9](images/image9.png)

### 3. CRUD "Orders"

**Скріншот 3.1: Сторінка списку замовлень (`/orders`)**
![image10](images/image10.png)
![image11](images/image11.png)

**Скріншот 3.2: Сторінка редагування замовлення (`/orders/:id`)**
![image12](images/image12.png)
![image13](images/image13.png)

**Скріншот 3.3: Сторінка створення замовлення (`/orders/new`)**
![image14](images/image14.png)
![image15](images/image15.png)
![image16](images/image16.png)

**Скріншот 3.4: Вкладка "Network" при успішному оновленні замовлення**
![image17](images/image17.png)
![image18](images/image18.png)