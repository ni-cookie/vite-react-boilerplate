import { createFileRoute } from '@tanstack/react-router';
import { OrderListPage } from '@/features/orders/pages/OrderListPage';

export const Route = createFileRoute('/orders/')({
  component: OrderListPage,
});