import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      customer: null,
      customerToken: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        const res = await api.post('/auth/customer/login', credentials);
        const { token, customer } = res.data;
        localStorage.setItem('ayasofya_customer_token', token);
        set({ customer, customerToken: token, isLoading: false });
        return customer;
      },

      register: async (data) => {
        set({ isLoading: true });
        const res = await api.post('/auth/customer/register', data);
        const { token, customer } = res.data;
        localStorage.setItem('ayasofya_customer_token', token);
        set({ customer, customerToken: token, isLoading: false });
        return customer;
      },

      logout: () => {
        localStorage.removeItem('ayasofya_customer_token');
        set({ customer: null, customerToken: null });
      },

      setCustomer: (customer) => set({ customer }),
    }),
    { name: 'ayasofya-auth', partialize: (s) => ({ customer: s.customer, customerToken: s.customerToken }) }
  )
);

export default useAuthStore;
