import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const adminLogin      = (data) => API.post('/auth/login', data);
export const getReport       = ()     => API.get('/admin/report');
export const getResidents    = ()     => API.get('/admin/residents');
export const getAllInvoices   = ()     => API.get('/invoices');
export const createInvoice   = (data) => API.post('/invoices', data);
export const getAllComplaints = ()     => API.get('/complaints');
export const updateComplaint = (id, data) => API.put(`/complaints/${id}/status`, data);
export const getNotices      = ()     => API.get('/notices');
export const postNotice      = (data) => API.post('/notices', data);
export const deleteNotice    = (id)   => API.delete(`/notices/${id}`);
export const getAllPayments   = ()     => API.get('/payments');