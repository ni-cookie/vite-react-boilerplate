import { z } from 'zod';

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .trim(), // <-- Добавляем .trim() для очистки от пробелов

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')), // Оставляем необязательным

  phone: z
    .string()
    .trim() // <-- Добавляем .trim() для очистки от пробелов
    .regex(
      new RegExp(/^\+380\d{9}$/), // Наше старое правило
      'Phone must be in the format +380XXXXXXXXX',
    ),

  // Возвращаем 'address', так как он ОБЯЗАТЕЛЕН в базе данных
  address: z
    .string()
    .min(1, 'Address is required') // Бэкенд-валидатор его по ошибке не проверяет, но БД требует
    .trim(), // <-- И ему тоже добавим .trim()
});

export type CustomerFormValues = z.infer<typeof customerSchema>;