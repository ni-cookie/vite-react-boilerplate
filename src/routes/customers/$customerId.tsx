import { createFileRoute } from '@tanstack/react-router';
import { CustomerEditPage } from '@/features/customers/pages/CustomerEditPage';

export const Route = createFileRoute('/customers/$customerId')({
  component: CustomerEditPage,
});