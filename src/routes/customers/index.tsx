import { createFileRoute } from '@tanstack/react-router';
import { CustomerListPage } from '@/features/customers/pages/CustomerListPage';

export const Route = createFileRoute('/customers/')({
  component: CustomerListPage,
});