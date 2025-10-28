import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { customerSchema, CustomerFormValues } from '@/features/customers/schema';
import { useCreateCustomer } from '@/features/customers/api';
import { Link } from '@tanstack/react-router';

export function CustomerCreatePage() {
  const createMutation = useCreateCustomer();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/customers" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Customers
      </Link>
      <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>
      <CustomerForm
        form={form}
        onSubmit={onSubmit}
        isPending={createMutation.isPending}
        submitText="Create Customer"
      />
    </div>
  );
}