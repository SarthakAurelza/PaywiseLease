
import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export async function getVehicleData({ brand, model, yearGroup }) {
  const res = await axios.post(`${BASE_URL}/get-vehicle-data`, { brand, model, yearGroup });
  return res.data;
}

export async function getLeaseData(payload) {
  const res = await axios.post(`${BASE_URL}/get-lease-data`, payload);
  return res.data;
} 