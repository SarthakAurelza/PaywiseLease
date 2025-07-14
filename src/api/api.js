
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export async function getVehicleData({ brand, model, yearGroup }) {
  const res = await axios.post(`${BASE_URL}/get-vehicle-data`, { brand, model, yearGroup });
  return res.data;
}

export async function getLeaseData(payload) {
  const res = await axios.post(`${BASE_URL}/get-lease-data`, payload);
  return res.data;
} 

export async function getBrands(){
  const res = await axios.get(`${BASE_URL}/makes`);
  return res.data
}

export async function getModels({ make }) {
  const res = await axios.post(`${BASE_URL}/models`, { make});
  return res.data;
}
