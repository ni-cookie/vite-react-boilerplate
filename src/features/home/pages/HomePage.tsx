import { Link } from '@tanstack/react-router';

export function HomePage() {
  return (
    <div className="p-4 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p>Choose where to go:</p>
      <div className="flex justify-center gap-4">
        <Link
          to="/customers"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Customers
        </Link>
        <Link
          to="/orders"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Orders
        </Link>
      </div>
    </div>
  );
}
