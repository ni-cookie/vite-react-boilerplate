// src/features/orders/pages/OrderEditPage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { orderSchema, OrderFormValues } from '@/features/orders/schema';
import { useOrder, useUpdateOrder } from '@/features/orders/api';
import { Link, useParams } from '@tanstack/react-router';

export function OrderEditPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const numericId = Number(orderId);

  const updateMutation = useUpdateOrder();
  const { data: order, isLoading, isError } = useOrder(numericId);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  // Коли дані завантажені, заповнюємо форму
  useEffect(() => {
    if (order) {
      // Важливо: форма очікує customer_id, а API повертає order.customer.id
    //   const simpleDate = order.order_date.split('T')[0];
      
      form.reset({
        customer_id: order.customer.id,
        flower_id: order.flower.id,
        quantity: order.quantity,
        price: order.price,
        order_date: order.orderDate ? order.orderDate : new Date().toISOString().split('T')[0],
        status: order.status,
      });
    }
  }, [order, form]);

  const onSubmit = (data: OrderFormValues) => {
    updateMutation.mutate({ id: numericId, data });
  };

  if (isLoading) return <div className="p-4">Loading order data...</div>;
  if (isError) return <div className="p-4">Error loading order.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/orders" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Orders
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Order #{order?.id}</h1>
      <OrderForm
        form={form}
        onSubmit={onSubmit}
        isPending={updateMutation.isPending}
        submitText="Save Changes"
      />
    </div>
  );
}