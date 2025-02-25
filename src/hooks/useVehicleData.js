import { useState } from "react";

const useVehicleData = () => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicleData = async (brand, model, yearGroup, onViewCalculation) => {
    if (!brand || !model || !yearGroup) {
      console.error("Missing required parameters for fetching vehicle data.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://lease-api-test.paywise.com.au/Vehicle/${encodeURIComponent(brand)}/${encodeURIComponent(model)}/${encodeURIComponent(yearGroup)}`;

      console.log("Fetching data from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_PAYWISE_API_AUTH_TOKEN}`, 
          "Accept": "text/plain",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      const selectedCar = data[0];
      setVehicleData(selectedCar);

      if (onViewCalculation) {
        onViewCalculation(data); // Pass the data to the callback
      }
      return selectedCar;
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { vehicleData, loading, error, fetchVehicleData };
};

export default useVehicleData;
