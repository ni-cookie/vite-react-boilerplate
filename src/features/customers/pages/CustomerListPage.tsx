import { Link } from '@tanstack/react-router';
import { useCustomers, useDeleteCustomer } from '@/features/customers/api';


export function CustomerListPage() {
  // Получаем список
  const { data: customers, isLoading, isError, error } = useCustomers();
  // Получаем мутацию для удаления
  const deleteMutation = useDeleteCustomer();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading customers...</div>;
  if (isError) return <div className="p-4">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link
          to="/home"
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mb-4 inline-block"
        >
          Back to Home
        </Link>
        <Link
          to="/customers/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Customer
        </Link>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b text-center">{customer.name}</td>
              <td className="py-2 px-4 border-b text-center">{customer.email}</td>
              <td className="py-2 px-4 border-b text-center">{customer.phone}</td>
              <td className="py-2 px-4 border-b text-center">{customer.address}</td>
              <td className="py-2 px-4 border-b text-center space-x-2">
                <Link
                  to="/customers/$customerId"
                  params={{ customerId: String(customer.id) }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}