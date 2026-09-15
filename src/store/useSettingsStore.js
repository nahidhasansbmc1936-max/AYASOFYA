import { create } from 'zustand';
import api from '../api/axios';

const useSettingsStore = create((set, get) => ({
  settings: {},
  loaded: false,

  fetchSettings: async () => {
    if (get().loaded) return;
    try {
      const res = await api.get('/settings/public');
      set({ settings: res.data.settings, loaded: true });
    } catch (_) {}
  },

  get: (key, fallback = '') => get().settings[key] ?? fallback,
}));

export default useSettingsStore;
