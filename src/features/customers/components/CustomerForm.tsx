import { useForm, UseFormReturn } from 'react-hook-form';
import type { CustomerFormValues } from '@/features/customers/schema';

type CustomerFormProps = {
  // Передаем методы формы снаружи
  form: UseFormReturn<CustomerFormValues>;
  // Функция, которая вызовется при отправке
  onSubmit: (data: CustomerFormValues) => void;
  // Состояние загрузки
  isPending: boolean;
  // Текст кнопки
  submitText: string;
};

export function CustomerForm({ form, onSubmit, isPending, submitText }: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input {...register('name')} className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input {...register('email')} className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input {...register('phone')} className="w-full p-2 border rounded" />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Address</label>
        <input {...register('address')} className="w-full p-2 border rounded" />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
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