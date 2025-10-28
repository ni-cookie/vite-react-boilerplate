// src/features/orders/components/OrderForm.tsx
import { UseFormReturn } from 'react-hook-form';
import type { OrderFormValues } from '@/features/orders/schema';

type OrderFormProps = {
  form: UseFormReturn<OrderFormValues>;
  onSubmit: (data: OrderFormValues) => void;
  isPending: boolean;
  submitText: string;
};

export function OrderForm({ form, onSubmit, isPending, submitText }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* TODO: В ідеалі, customer_id та flower_id мають бути <select>
        зі списком, завантаженим з API. 
        Для простоти ми використовуємо input[type=number].
        Вам потрібно буде створити хуки useCustomers та useFlowers,
        щоб заповнити ці <select>.
      */}
      <div>
        <label className="block mb-1 font-medium">Customer ID</label>
        <input
          type="number"
          {...register('customer_id')}
          className="w-full p-2 border  rounded"
        />
        {errors.customer_id && <p className="text-red-500 text-sm mt-1">{errors.customer_id.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Flower ID</label>
        <input
          type="number"
          {...register('flower_id')}
          className="w-full p-2 border rounded"
        />
        {errors.flower_id && <p className="text-red-500 text-sm mt-1">{errors.flower_id.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          {...register('quantity')}
          className="w-full p-2 border rounded"
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price')}
          className="w-full p-2 border rounded"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Order Date</label>
        <input
          type="date"
          {...register('order_date')}
          className="w-full p-2 border rounded"
        />
        {errors.order_date && <p className="text-red-500 text-sm mt-1">{errors.order_date.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          {...register('status')}
          className="w-full p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? 'Saving...' : submitText}
      </button>
    </form>
  );
}