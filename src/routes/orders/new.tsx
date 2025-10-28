import { createFileRoute } from '@tanstack/react-router';
import { OrderCreatePage } from '@/features/orders/pages/OrderCreatePage';

export const Route = createFileRoute('/orders/new')({
  component: OrderCreatePage,
});