// src/features/orders/schema.ts
import { z } from 'zod';

// Синхронізуємо це з вашими валідаторами бэкенду

export const orderSchema = z.object({
  // Використовуємо coerce.number(), щоб автоматично перетворити
  // рядкові значення з полів <input> на числа перед валідацією
  customer_id: z.coerce
    .number()
    .int()
    .gt(0, 'Customer ID must be a positive integer'),

  flower_id: z.coerce
    .number()
    .int()
    .gt(0, 'Flower ID must be a positive integer'),

  quantity: z.coerce
    .number()
    .int()
    .gt(0, 'Quantity must be a positive integer'),

  price: z.coerce
    .number()
    .gt(0, 'Price must be a positive number'),

  // HTML input type="date" повертає рядок YYYY-MM-DD,
  // який пройде валідацію isISO8601 на бэкенді.
  order_date: z.string().min(10, 'Order date is required'),

  // Створюємо enum на основі дозволених статусів
  status: z.enum(['pending', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be pending, completed, or cancelled' }),
  }),
});

export type OrderFormValues = z.infer<typeof orderSchema>;