export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  // created_at и updated_at можно добавить, если они вам нужны
}

// Тип для создания/обновления
// (id будет назначаться сервером)
export type CustomerDto = Omit<Customer, 'id'>;