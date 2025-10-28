import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

// persist сохраняет токен в localStorage, чтобы он не пропадал при перезагрузке
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, // По умолчанию токена нет
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage', // Имя ключа в localStorage
    },
  ),
);