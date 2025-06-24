import { useState } from "react";

const useQuoteData = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuoteData = async (vehicleData, userInput) => {
    if (!vehicleData || typeof vehicleData !== "object") {
      console.error("🚫 Invalid or missing vehicle data.");
      return;
    }

    if (!userInput || typeof userInput !== "object") {
      console.error("🚫 Invalid or missing user input.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/get-lease-data`;

      const requestBody = {
        calculationPeriods: ["Weekly", "Monthly", "Fortnightly"],
        vehicle: {
          fuelCombined: Number(vehicleData.fuelCombined) || 0,
          fuelType: vehicleData.fuelType || "Unknown",
          regServiceMonths: Number(vehicleData.regServiceMonths) || 12,
          vFactsSegment: vehicleData.vFactsSegment || "Unknown",
          vFactsClass: vehicleData.vFactsClass || "Unknown",
          vehicleID: Number(vehicleData.vehicleID) || 1,
          variant: vehicleData.variant || "Unknown",
          series: vehicleData.series || "Unknown",
          badgeDescription: vehicleData.badgeDescription || "",
          secondaryBadgeDescription: vehicleData.secondaryBadgeDescription || "",
          imageCode: vehicleData.imageCode || "default",
          bodyStyle: vehicleData.bodyStyle || "Unknown",
          doors: Number(vehicleData.doors) || 4,
          engineDescription: vehicleData.engineDescription || "Unknown",
          engineCylinders: Number(vehicleData.engineCylinders) || 0,
          engineTypeDescription: vehicleData.engineTypeDescription || "Unknown",
          gears: Number(vehicleData.gears) || 0,
          gearTypeDescription: vehicleData.gearTypeDescription || "Unknown",
          inductionDescription: vehicleData.inductionDescription || "Unknown",
          isCurrentModel: !!vehicleData.isCurrentModel,
          isActive: !!vehicleData.isActive,
          maintenanceProfileType: vehicleData.maintenanceProfileType || "Standard",
          powerPlantType: typeof vehicleData.engineTypeDescription === "string" &&
            vehicleData.engineTypeDescription.includes("Electric") ? "EV" : "ICE",
          make: vehicleData.make || "Unknown",
          model: vehicleData.model || "Unknown",
          yearGroup: vehicleData.yearGroup || new Date().getFullYear(),
          fuelMetro: Number(vehicleData.fuelMetro) || 0,
          vehicleOptions: Array.isArray(vehicleData.vehicleOptions) ? vehicleData.vehicleOptions : [],
          cO2Combined: Number(vehicleData.cO2Combined) || 0,
          vehicleType: vehicleData.vehicleType || "PassengerVehicle",
          redBookID: vehicleData.redBookID || "",
          listPrice: Number(vehicleData.listPrice) || 0,
          frontTyreSpecification: {
            size: vehicleData.frontTyreSpecification?.size || "Unknown",
            replacementCost: Number(vehicleData.frontTyreSpecification?.replacementCost) || 0,
            replacementInterval: Number(vehicleData.frontTyreSpecification?.replacementInterval) || 0,
          },
          rearTyreSpecification: {
            size: vehicleData.rearTyreSpecification?.size || "Unknown",
            replacementCost: Number(vehicleData.rearTyreSpecification?.replacementCost) || 0,
            replacementInterval: Number(vehicleData.rearTyreSpecification?.replacementInterval) || 0,
          },
          maintenanceProfile: {
            name: vehicleData.maintenanceProfile?.name || "Unknown",
            majorServicePrice: Number(vehicleData.maintenanceProfile?.majorServicePrice) || 0,
          },
          firstServiceKm: Number(vehicleData.firstServiceKm) || 5000,
          regServiceKm: Number(vehicleData.regServiceKm) || 15000,
        },
        financier: {
          id: 14,
          name: "Angle Auto Finance Pty Ltd",
          interestRate: 0.0954,
          residualCostMethod: "DepreciableValue",
          financierEntity: "Angle",
          originatorFeeMaximum: 1100,
        },
        originatorFee: 1100,
        purchasePrice: Number(vehicleData.listPrice) || 0,
        salePrice: Number(vehicleData.listPrice) || 0,
        state: userInput.state || "Unknown",
        annualKms: Number(userInput.annualKms) || 10000,
        leaseTerm: Number(userInput.leaseTerm) || 12,
        annualSalary: Number(userInput.annualSalary) || 50000,
        hasHECS: !!userInput.hasHECS,
        calculationDate: new Date().toISOString(),
        totalOptionsSale: 0,
        totalOptionsPrice: 0,
        isNewVehicle: true,
        membershipFee: 0,
        managementFee: 468,
        startingOdometer: 0,
        budgetOverrides: {
          fuelNet: userInput.budgetOverrides?.fuelNet ?? null,
          maintenanceNet: userInput.budgetOverrides?.maintenanceNet ?? null,
          tyreNet: userInput.budgetOverrides?.tyreNet ?? null,
          regoNet: userInput.budgetOverrides?.regoNet ?? null,
          insuranceNet: userInput.budgetOverrides?.insuranceNet ?? null,
        },
        commissionPercentage: 0.1,
        deferredPeriods: 2,
        fbtExemption: false,
        managementType: "InternallyManaged",
        bureau: "Internal",
        insurance: {
          age: Number(userInput.age) || 35,
          provider: "Paywise",
          insuranceRate: {
            insuranceType: "Standard1",
            leaseInsuranceRate: {
              claimExcess: 600,
              baseCost: 988.17,
              stampDutyRate: 0.1,
              fireServiceLevyRate: 0,
              fee: 0,
              gapPremium: 17.79,
              gapStampDutyRate: 0.1,
            },
            isEligible: "Yes",
            errorMessage: "",
          },
        },
        includeGAP: !!userInput.includeGAP,
        includeRoadSide: !!userInput.includeRoadSide,
        includeLuxuryCarCharge: true,
      };

      console.log("📦 Sending request payload to API:", requestBody);

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
      return data;
    } catch (err) {
      console.error("Error fetching quote data:", err);
      console.warn("Request Body that caused error: ",requestBody)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { quoteData, loading, error, fetchQuoteData };
};

export default useQuoteData;
