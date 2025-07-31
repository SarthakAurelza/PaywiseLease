import { useState } from "react";

const useQuoteData = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to safely get numeric values
  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) || value === undefined || value === null ? defaultValue : num;
  };

  // Helper function to safely get string values
  const safeString = (value, defaultValue = "") => {
    return value === undefined || value === null ? defaultValue : String(value);
  };

  // Helper function to safely get boolean values
  const safeBoolean = (value, defaultValue = false) => {
    return value === undefined || value === null ? defaultValue : Boolean(value);
  };

  // Helper function to safely get array values
  const safeArray = (value, defaultValue = []) => {
    return Array.isArray(value) ? value : defaultValue;
  };

  // Helper function to build tire specification with defaults
  const buildTyreSpec = (tyreSpec) => {
    if (!tyreSpec || typeof tyreSpec !== 'object') {
      return {
        size: "215/60 R17",
        replacementCost: 400,
        replacementInterval: 40000
      };
    }
    return {
      size: safeString(tyreSpec.size, "215/60 R17"),
      replacementCost: safeNumber(tyreSpec.replacementCost, 400),
      replacementInterval: safeNumber(tyreSpec.replacementInterval, 40000)
    };
  };

  // Helper function to build maintenance profile
  const buildMaintenanceProfile = (profile, profileType) => {
    if (profile && typeof profile === 'object' && profile.name) {
      return {
        name: safeString(profile.name, "Standard Service"),
        majorServicePrice: safeNumber(profile.majorServicePrice, 400)
      };
    }
    
    // Create default based on profile type or fallback
    const defaultName = safeString(profileType, "Standard Service");
    return {
      name: defaultName,
      majorServicePrice: 400
    };
  };

  const fetchQuoteData = async (vehicleData, userInput) => {
    console.log("the vehicle data is: ", vehicleData);
    
    // Build vehicle object with type safety and defaults
    const vehicle = {
      "vehicleID": safeNumber(vehicleData.vehicleId || vehicleData.vehicleID, 1), // Fallback ID if missing
      "make": safeString(vehicleData.make, "Unknown"),
      "model": safeString(vehicleData.model, "Unknown"),
      "yearGroup": safeNumber(vehicleData.yearGroup, new Date().getFullYear()),
      "listPrice": safeNumber(vehicleData.listPrice, 0),
      "variant": safeString(vehicleData.variant, "Standard"),
      "fuelCombined": safeNumber(vehicleData.fuelCombined, 0),
      "fuelType": safeString(vehicleData.fuelType, "Petrol"),
      "regServiceMonths": safeNumber(vehicleData.regServiceMonths, 12),
      "vFactsSegment": safeString(vehicleData.vFactsSegment, "Medium"),
      "vFactsClass": safeString(vehicleData.vFactsClass, "SUV"),
      "series": safeString(vehicleData.series, "Standard"),
      "badgeDescription": safeString(vehicleData.badgeDescription, "Standard"),
      "imageCode": safeString(vehicleData.imageCode, ""),
      "bodyStyle": safeString(vehicleData.bodyStyle, "WAGON"),
      "doors": safeNumber(vehicleData.doors, 5),
      "engineDescription": safeString(vehicleData.engineDescription, "Standard"),
      "engineCylinders": safeNumber(vehicleData.engineCylinders, 4),
      "engineTypeDescription": safeString(vehicleData.engineTypeDescription, "Piston"),
      "gears": safeNumber(vehicleData.gears, 6),
      "gearTypeDescription": safeString(vehicleData.gearTypeDescription, "Automatic"),
      "inductionDescription": safeString(vehicleData.inductionDescription, ""),
      "isCurrentModel": safeBoolean(vehicleData.isCurrentModel, false),
      "isActive": safeBoolean(vehicleData.isActive, true),
      "maintenanceProfileType": safeString(vehicleData.maintenanceProfileType, "Standard Service"),
      "powerPlantType": safeString(vehicleData.powerPlantType, "ICE"),
      "fuelMetro": safeNumber(vehicleData.fuelMetro, 0),
      "vehicleOptions": safeArray(vehicleData.vehicleOptions, [
        {
          "description": "Standard Paint",
          "priceExGST": 0,
          "vehicleOptionSource": 1
        }
      ]),
      "cO2Combined": safeNumber(vehicleData.cO2Combined, 0),
      "vehicleType": safeString(vehicleData.vehicleType, "SUV"),
      "redBookID": safeString(vehicleData.redBookId || vehicleData.redBookID, `AUV${safeString(vehicleData.make, "UNK").toUpperCase()}${safeNumber(vehicleData.yearGroup, 2024)}XXXX`),
      "frontTyreSpecification": buildTyreSpec(vehicleData.frontTyreSpecification),
      "rearTyreSpecification": buildTyreSpec(vehicleData.rearTyreSpecification),
      "maintenanceProfile": buildMaintenanceProfile(vehicleData.maintenanceProfile, vehicleData.maintenanceProfileType),
      "firstServiceKm": safeNumber(vehicleData.firstServiceKm, 10000),
      "regServiceKm": safeNumber(vehicleData.regServiceKm, 10000)
    };

    console.log("VEHICLE DATA IS: ", vehicle);

    const requestBody = {
      calculationPeriods: ["Weekly", "Monthly", "Fortnightly"],
      vehicle,
      financier: {
        id: 14,
        name: "Angle Auto Finance Pty Ltd",
        interestRate: 0.0954,
        residualCostMethod: "DepreciableValue",
        financierEntity: "Angle",
        originatorFeeMaximum: 1100,
      },
      originatorFee: 1100,
      purchasePrice: vehicle.listPrice,
      salePrice: vehicle.listPrice,
      state: safeString(userInput.state, "NSW"),
      annualKms: safeNumber(userInput.annualKms, 15000),
      leaseTerm: safeNumber(userInput.leaseTerm, 3) * 12, // Ensure minimum 12 months
      annualSalary: safeNumber(userInput.annualSalary, 50000),
      hasHECS: false,
      calculationDate: new Date().toISOString(),
      totalOptionsSale: 0,
      totalOptionsPrice: 0,
      isNewVehicle: true,
      membershipFee: 0,
      managementFee: 468,
      startingOdometer: 0,
      budgetOverrides: {
        "fuelNet": null,
        "maintenanceNet": null,
        "tyreNet": null,
        "regoNet": null,
        "insuranceNet": null,
      },
      commissionPercentage: 0.1,
      deferredPeriods: 2,
      fbtExemption: false,
      managementType: "InternallyManaged",
      bureau: "Internal",
      insurance: {
        age: 35,
        provider: "Paywise",
        insuranceRate: {
          insuranceType: "Standard1",
          leaseInsuranceRate: {},
          isEligible: "Yes",
          errorMessage: "",
        },
      },
      includeGAP: true,
      includeRoadSide: false,
      includeLuxuryCarCharge: true,
    };

    console.log("📦 Sending request payload to API:", requestBody);

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/get-lease-data`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setQuoteData(data);
      console.log("THIS IS THE STUFF: ", data);
      return data;
    } catch (err) {
      console.error("Error fetching quote data:", err);
      console.warn("Request Body that caused error: ", requestBody);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { quoteData, loading, error, fetchQuoteData };
};

export default useQuoteData;
