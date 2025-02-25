import { useState } from "react";

const useQuoteData = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuoteData = async (vehicleData, userInput) => {
    if (!vehicleData) {
      console.error("Vehicle data is required to fetch quote.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://lease-api-test.paywise.com.au/Quote`;

      // ✅ Extract only the required fields from vehicleData
      const requestBody = {
        calculationPeriods: ["Weekly", "Monthly","Fortnightly"],
        vehicle: {
          fuelCombined: vehicleData.fuelCombined ?? 0,
          fuelType: vehicleData.fuelType ?? "Unknown",
          regServiceMonths: vehicleData.regServiceMonths ?? 12,
          vFactsSegment: vehicleData.vFactsSegment ?? "Unknown",
          vFactsClass: vehicleData.vFactsClass ?? "Unknown",
          vehicleID: vehicleData.vehicleID ?? 0,
          variant: vehicleData.variant ?? "Unknown",
          series: vehicleData.series ?? "Unknown",
          badgeDescription: vehicleData.badgeDescription ?? "",
          secondaryBadgeDescription: vehicleData.secondaryBadgeDescription ?? "",
          imageCode: vehicleData.imageCode ?? "",
          bodyStyle: vehicleData.bodyStyle ?? "Unknown",
          doors: vehicleData.doors ?? 4,
          engineDescription: vehicleData.engineDescription ?? "Unknown",
          engineCylinders: vehicleData.engineCylinders ?? 0,
          engineTypeDescription: vehicleData.engineTypeDescription ?? "Unknown",
          gears: vehicleData.gears ?? 0,
          gearTypeDescription: vehicleData.gearTypeDescription ?? "Unknown",
          inductionDescription: vehicleData.inductionDescription ?? "Unknown",
          isCurrentModel: vehicleData.isCurrentModel ?? false,
          isActive: vehicleData.isActive ?? false,
          maintenanceProfileType: vehicleData.maintenanceProfileType ?? "Standard",
          powerPlantType: vehicleData.engineTypeDescription.includes("Electric") ? "EV" : "ICE",
          make: vehicleData.make ?? "Unknown",
          model: vehicleData.model ?? "Unknown",
          yearGroup: vehicleData.yearGroup ?? new Date().getFullYear(),
          fuelMetro: vehicleData.fuelMetro ?? 0,
          vehicleOptions: vehicleData.vehicleOptions ?? [],
          cO2Combined: vehicleData.cO2Combined ?? 0,
          vehicleType: vehicleData.vehicleType ?? "PassengerVehicle",
          redBookID: vehicleData.redBookID ?? "",
          listPrice: vehicleData.listPrice ?? 0,
          frontTyreSpecification: vehicleData.frontTyreSpecification ?? {
            size: "Unknown",
            replacementCost: 0,
            replacementInterval: 0,
          },
          rearTyreSpecification: vehicleData.rearTyreSpecification ?? {
            size: "Unknown",
            replacementCost: 0,
            replacementInterval: 0,
          },
          maintenanceProfile: vehicleData.maintenanceProfile ?? {
            name: "Unknown",
            majorServicePrice: 0,
          },
          firstServiceKm: vehicleData.firstServiceKm ?? 5000,
          regServiceKm: vehicleData.regServiceKm ?? 15000,
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
        purchasePrice: vehicleData.listPrice ?? 0,
        salePrice: vehicleData.listPrice ?? 0,
        state: userInput.state, // User provided
        annualKms: userInput.annualKms, // User provided
        leaseTerm: userInput.leaseTerm, // User provided
        annualSalary: userInput.annualSalary, // User provided
        hasHECS: userInput.hasHECS, // User provided
        calculationDate: new Date().toISOString(),
        totalOptionsSale: 0,
        totalOptionsPrice: 0,
        isNewVehicle: true,
        membershipFee: 0,
        managementFee: 468,
        startingOdometer: 0,
        budgetOverrides: userInput.budgetOverrides ?? {
          fuelNet: null,
          maintenanceNet: null,
          tyreNet: null,
          regoNet: null,
          insuranceNet: null,
        },
        commissionPercentage: 0.1,
        deferredPeriods: 2,
        fbtExemption: false,
        managementType: "InternallyManaged",
        bureau: "Internal",
        insurance: {
          age: userInput.age, // User provided
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
        includeGAP: userInput.includeGAP, // User provided
        includeRoadSide: userInput.includeRoadSide, // User provided
        includeLuxuryCarCharge: true,
      };


      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_PAYWISE_API_AUTH_TOKEN}`,
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { quoteData, loading, error, fetchQuoteData };
};

export default useQuoteData;
