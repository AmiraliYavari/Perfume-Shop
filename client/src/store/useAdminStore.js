import { create } from 'zustand';

const useAdminStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  setToken: (token) => {
    localStorage.setItem('admin_token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null });
  },
}));

export default useAdminStore;