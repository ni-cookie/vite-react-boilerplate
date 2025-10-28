import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { customerSchema, CustomerFormValues } from '@/features/customers/schema';
import { useCustomer, useUpdateCustomer } from '@/features/customers/api';
import { Link, useParams } from '@tanstack/react-router';

export function CustomerEditPage() {
  // Получаем ID из URL (TanStack Router)
  const { customerId } = useParams({ from: '/customers/$customerId' });
  const numericId = Number(customerId);

  const updateMutation = useUpdateCustomer();

  // 1. Получаем данные клиента
  const { data: customer, isLoading, isError } = useCustomer(numericId);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  // 2. Как только данные загружены, заполняем форму
  useEffect(() => {
    if (customer) {
      form.reset(customer);
    }
  }, [customer, form]);

  // 3. При отправке формы, вызываем мутацию обновления
  const onSubmit = (data: CustomerFormValues) => {
    updateMutation.mutate({ id: numericId, data });
  };

  if (isLoading) return <div className="p-4">Loading customer data...</div>;
  if (isError) return <div className="p-4">Error loading customer.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/customers" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Customers
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Customer</h1>
      <CustomerForm
        form={form}
        onSubmit={onSubmit}
        isPending={updateMutation.isPending}
        submitText="Save Changes"
      />
    </div>
  );
}