// src/features/orders/pages/OrderCreatePage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { orderSchema, OrderFormValues } from '@/features/orders/schema';
import { useCreateOrder } from '@/features/orders/api';
import { Link } from '@tanstack/react-router';

export function OrderCreatePage() {
  const createMutation = useCreateOrder();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: 0,
      flower_id: 0,
      quantity: 1,
      price: 10.0,
      order_date: new Date().toISOString().split('T')[0], // Сьогоднішня дата
      status: 'pending',
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/orders" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Orders
      </Link>
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>
      <OrderForm
        form={form}
        onSubmit={onSubmit}
        isPending={createMutation.isPending}
        submitText="Create Order"
      />
    </div>
  );
}