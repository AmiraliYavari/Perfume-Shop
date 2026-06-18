import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const fetchFilters = () => API.get('/filters');
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const submitOrder = (orderData) => API.post('/orders', orderData);