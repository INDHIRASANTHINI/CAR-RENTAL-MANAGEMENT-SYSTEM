import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('[API] Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[API Request]', config.method.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  response => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('[API Error]', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const carAPI = {
  getAllCars: (filters) => api.get('/cars', { params: filters }),
  getCarById: (id) => api.get(`/cars/${id}`),
  addCar: (data) => api.post('/cars', data),
  updateCar: (id, data) => api.put(`/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  updateCarStatus: (id, status) => api.patch(`/cars/${id}/status`, { status })
};

export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  getAllBookings: (filters) => api.get('/bookings', { params: filters }),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status })
};

export const paymentAPI = {
  processPayment: (data) => api.post('/payments', data),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  getMyPayments: () => api.get('/payments/my-payments'),
  getAdminStats: () => api.get('/payments/stats'),
  refundPayment: (id) => api.post(`/payments/${id}/refund`)
};

export const offerAPI = {
  getAllOffers: () => api.get('/offers'),
  getActiveOffers: () => api.get('/offers/active'),
  validateOffer: (data) => api.post('/offers/validate', data),
  createOffer: (data) => api.post('/offers', data),
  updateOffer: (id, data) => api.put(`/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/offers/${id}`)
};

export default api;
