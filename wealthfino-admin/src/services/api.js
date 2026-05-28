import axios from 'axios';
import { Platform } from 'react-native';

// On Expo Web (browser), localhost:5000 works fine.
// On a physical Android device, localhost resolves to the device itself;
// use the Vercel deployment as the fallback for real devices.
export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:5000'           // Expo web renderer → Express dev server
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

export default api;
