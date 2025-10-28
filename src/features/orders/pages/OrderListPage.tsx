// src/features/orders/pages/OrderListPage.tsx
import { Link } from '@tanstack/react-router';
import { useOrders, useDeleteOrder } from '@/features/orders/api';

export function OrderListPage() {
  const { data: orders, isLoading, isError, error } = useOrders();
  const deleteMutation = useDeleteOrder();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading orders...</div>;
  if (isError) return <div className="p-4">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link
          to="/home"
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mb-4 inline-block"
        >
          Back to Home
        </Link>
        <Link
          to="/orders/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Order
        </Link>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Flower</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b text-center">{order.id}</td>
              {/* API повертає вкладені об'єкти */}
              <td className="py-2 px-4 border-b text-center">{order.customer?.name} (ID: {order.customer?.id})</td>
              <td className="py-2 px-4 border-b text-center">{order.flower?.name} (ID: {order.flower?.id})</td>
              <td className="py-2 px-4 border-b text-center">{order.quantity}</td>
              <td className="py-2 px-4 border-b text-center">${order.price}</td>
              <td className="py-2 px-4 border-b text-center">{order.orderDate ? order.orderDate : 'dd.mm.yyyy'}</td>
              <td className="py-2 px-4 border-b text-center">{order.status}</td>
              <td className="py-2 px-4 border-b text-center space-x-2">
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: String(order.id) }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
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