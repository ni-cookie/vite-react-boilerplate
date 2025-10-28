import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});