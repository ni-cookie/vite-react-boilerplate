import { createFileRoute } from '@tanstack/react-router';
import { OrderEditPage } from '@/features/orders/pages/OrderEditPage';

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderEditPage,
});