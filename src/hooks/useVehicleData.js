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
      const apiUrl = `http://localhost:3001/api/get-vehicle-data`;
      const requestBody = { brand, model, yearGroup };

      console.log("Fetching data from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMGM1YzhjNC1kMmE2LTRiNWQtOTc3MC1lZGI0OWFhODBjNTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMDMyMWIzOWUtZGVmYS00Y2MzLTkyYWUtNDgyMjIyNmViNTliL3YyLjAiLCJpYXQiOjE3NDM3NDU0MTMsIm5iZiI6MTc0Mzc0NTQxMywiZXhwIjoxNzQzNzQ5ODA1LCJhaW8iOiJBWFFBaS84WkFBQUFCbWtxcDAwd3VqaHp3Vzg2NlJ5aVJHVS9wNVZlR0JpQTFiQWpxYUpCSkk2UW9zN3d3bzlsOGVrZlF2KzVBVnpyT21SUS9QdVF0a2ltK3pES0VrenYxWVZ1REM4OGU5SjN5QUFLbURuZU9pYllZcVQ0YWFIVTlqTTRidFlVT1dvR3dWNERDQVNqLzBPdk1pZytJUzFPdGc9PSIsImF6cCI6ImY1ZWQ4MzQwLTE5ZmMtNDhjMC1hM2RiLWRmNDQzMTQ1MjdkZiIsImF6cGFjciI6IjAiLCJuYW1lIjoiQXVyZWx6YSIsIm9pZCI6IjFhYWY4Y2FhLTQ1ZjQtNDQ5Ni05YTkyLTZlMTNhMTdlNTllOCIsInByZWZlcnJlZF91c2VybmFtZSI6IkF1cmVsemFAcGF5d2lzZS5vbm1pY3Jvc29mdC5jb20iLCJyaCI6IjEuQVVFQW5yTWhBX3JldzB5U3JrZ2lJbTYxbThUSXhRQ20wbDFMbDNEdHRKcW9ERlBzQURSQkFBLiIsInNjcCI6ImJyb2tlcmZpbmFuY2llcjpyZWFkIGVtcGxveWVyOnJlYWQgZmluYW5jaWVyOnJlYWQgaW5zdXJhbmNlOnJlYWQgcXVvdGU6Y2FsY3VsYXRlIHF1b3RlOmNvbnZlcnQgcXVvdGU6cGRmIHZlaGljbGU6cmVhZCIsInNpZCI6IjAwMjAzYTE5LTI2NjktYzRhZi05MzQyLTk4Y2YyM2U3OTJmNiIsInN1YiI6IlhQWndCT1lSZ2dXYUhiU2ZJbVVZLUJfUEZ5ekpJZFF0R3ppRVNRaEVzbFEiLCJ0aWQiOiIwMzIxYjM5ZS1kZWZhLTRjYzMtOTJhZS00ODIyMjI2ZWI1OWIiLCJ1dGkiOiJLSEJTX0V3cmtVYUdpM2VwSjBVM0FBIiwidmVyIjoiMi4wIn0.HbxMnJFRl6eRaDgVZmjGYSKBBfAWjtubV9xYvFy9ihznJyk4dP4RRo8YaogJnbOP9NbBH8QzDgnh_a6nHSv9zhM36MX0xGxdfWa7MrTQ1aq0DkUAzhPVJ7YyJ0v5HcPyB27jGvfICWgj5X9-aT0M5Ve8UyFdo__vEKMcTYWku0a--uIJKaQyGiHJ6UC89yzhW0CsNT776MPV-wwtpaqecgO5nK734x1le1ydSkx9YgSRzTX-APqw_M9m3XNTJsV-G5Cd1Nz6XmBVxX-dkPP_cdYLIVtY2bPw3oQ4ACV5SzWiPMSbdpsS5Bxm0f4_kT3rG4STtrs-KomOHsCW_cTbCA`
        },
        body: JSON.stringify(requestBody),
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
