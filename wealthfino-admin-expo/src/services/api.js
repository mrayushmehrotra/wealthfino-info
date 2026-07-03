import axios from 'axios';
import { Platform } from 'react-native';

// On Expo Web (browser), localhost:5000 works fine.
// On a physical Android device, localhost resolves to the device itself;
// use the Vercel deployment as the fallback for real devices.
export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'https://wealthfino-info.vercel.app'           // Expo web renderer → Express dev server
    : 'https://wealthfino-info.vercel.app'; // Real iOS/Android device → production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Complaints ───────────────────────────────────────────────
export const fetchComplaints = async () => {
  const { data } = await api.get('/api/complaints');
  return data;
};

export const updateComplaints = async (payload) => {
  const { data } = await api.put('/api/complaints', payload);
  return data;
};

// ─── Client Consent ───────────────────────────────────────────
export const fetchClientConsent = async () => {
  const { data } = await api.get('/api/client-consent');
  return data;
};

export const updateClientConsent = async (payload) => {
  const { data } = await api.put('/api/client-consent', payload);
  return data;
};

// ─── Trade Cards ────────────────────────────────────────────
export const fetchTradeCards = async () => {
  const { data } = await api.get('/api/trade-cards');
  return data;
};

export const createTradeCard = async (payload) => {
  const { data } = await api.post('/api/trade-cards', payload);
  return data;
};

export const updateTradeCard = async ({ id, ...payload }) => {
  const { data } = await api.put(`/api/trade-cards/${id}`, payload);
  return data;
};

export const deleteTradeCard = async (id) => {
  const { data } = await api.delete(`/api/trade-cards/${id}`);
  return data;
};

// ─── Contact ───────────────────────────────────────────────
export const fetchContact = async () => {
  const { data } = await api.get('/api/contact');
  return data;
};

export const updateContact = async (payload) => {
  const { data } = await api.put('/api/contact', payload);
  return data;
};

export default api;
