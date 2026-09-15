import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminApi } from '../api/axios';

const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,

      login: async (email, password) => {
        const res = await adminApi.post('/auth/admin/login', { email, password });
        const { token, admin } = res.data;
        localStorage.setItem('ayasofya_admin_token', token);
        set({ admin, token });
        return admin;
      },

      logout: () => {
        localStorage.removeItem('ayasofya_admin_token');
        set({ admin: null, token: null });
      },

      setAdmin: (admin) => set({ admin }),
    }),
    { name: 'ayasofya-admin', partialize: (s) => ({ admin: s.admin, token: s.token }) }
  )
);

export default useAdminStore;
