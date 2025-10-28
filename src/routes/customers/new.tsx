import { createFileRoute } from '@tanstack/react-router';
import { CustomerCreatePage } from '@/features/customers/pages/CustomerCreatePage';

export const Route = createFileRoute('/customers/new')({
  component: CustomerCreatePage,
});