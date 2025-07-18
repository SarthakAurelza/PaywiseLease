import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVehicleData, getLeaseData, getModels } from "../api/api";

export default function useVehicles() {
  const HARDCODED_DATA = {
    brands: ["Toyota", "Tesla"],
    models: {
      Toyota: ["Kluger", "Camry", "Fortuner"],
      Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
    },
  };

  const YEARS = ["2024", "2025"];
  const PAGE_SIZE = 4;
  const LEASE_THROTTLE = Math.min(navigator?.hardwareConcurrency || 4, 8);

  const filters = useSelector((state) => state.filters);
  const { brand, model } = filters;

  const [allVehicles, setAllVehicles] = useState([]);
  const [cars, setCars] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const processLeasePrices = async (carsBatch) => {
    for (let i = 0; i < carsBatch.length; i += LEASE_THROTTLE) {
      const slice = carsBatch.slice(i, i + LEASE_THROTTLE);
      await Promise.all(
        slice.map(async (car) => {
          try {
            const vehicle = {
              ...car,
              vehicleID: car.vehicleID ?? car.id ?? Math.floor(Math.random() * 100000),
              make: car.brand ?? car.make ?? "Toyota",
              model: car.model ?? "Unknown",
              yearGroup: car.yearGroup ?? 2025,
              listPrice: car.listPrice ?? 85135,
            };

            const payload = {
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
              state: "NSW",
              annualKms: 15000,
              leaseTerm: 36,
              annualSalary: 80000,
              hasHECS: false,
              calculationDate: new Date().toISOString(),
              totalOptionsSale: 0,
              totalOptionsPrice: 0,
              isNewVehicle: true,
              membershipFee: 0,
              managementFee: 468,
              startingOdometer: 0,
              budgetOverrides: {},
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

            const leaseData = await getLeaseData(payload);

            if (leaseData?.periodicCalculations?.length) {
              const priceObj = {};
              ["Weekly", "Monthly", "Fortnightly"].forEach((period) => {
                const found = leaseData.periodicCalculations.find((p) => p.period === period);
                if (found?.cost?.budget?.budgetTotal != null) {
                  priceObj[period.toLowerCase()] = found.cost.budget.budgetTotal;
                }
              });

              if (priceObj.weekly != null) {
                setPrices((prev) => ({
                  ...prev,
                  [vehicle.vehicleID]: priceObj,
                }));
              }
            }
          } catch (err) {
            console.warn("Lease price fetch failed for:", car, err);
          }
        })
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("[useVehicles] Fetch triggered with filters:", filters);
      setLoading(true);
      setError(null);

      const payloads = [];

      if (!brand) {
        console.log("[useVehicles] No filters selected, using hardcoded data.");
        HARDCODED_DATA.brands.forEach((b) => {
          HARDCODED_DATA.models[b].forEach((m) => {
            YEARS.forEach((yearGroup) => {
              payloads.push({ brand: b, model: m, yearGroup });
            });
          });
        });
      } else if (brand && !model) {
        console.log(`[useVehicles] Brand selected (${brand}), fetching models dynamically.`);
        let brandModels = [];

        try {
          brandModels = await getModels({ make: brand });
        } catch (err) {
          console.warn(`[useVehicles] Failed to fetch models for brand: ${brand}`, err);
        }

        if (brandModels.length === 0) {
          console.warn(`[useVehicles] No models found for brand: ${brand}`);
        }

        brandModels.forEach((m) => {
          YEARS.forEach((yearGroup) => {
            payloads.push({ brand, model: m, yearGroup });
          });
        });
      } else if (brand && model) {
        console.log(`[useVehicles] Brand (${brand}) and model (${model}) selected.`);
        YEARS.forEach((yearGroup) => {
          payloads.push({ brand, model, yearGroup });
        });
      }

      if (payloads.length === 0) {
        console.warn("[useVehicles] No payloads generated. Skipping fetch.");
        setAllVehicles([]);
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          payloads.map((p) => getVehicleData(p).catch((err) => {
            console.warn("Vehicle fetch failed for:", p, err);
            return null;
          }))
        );

        const flattened = results.filter(Boolean).flat();
        console.log(`[useVehicles] Fetched ${flattened.length} vehicles total`);

        setAllVehicles(flattened);
        setCurrentPage(1);

        await processLeasePrices(flattened);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);
        setError("Something went wrong while loading vehicles.");
        setAllVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brand, model]);

  useEffect(() => {
    const total = allVehicles.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    setCars(allVehicles.slice(start, end));
    setTotalPages(pages);

    console.log(`[useVehicles] Page ${currentPage} of ${pages} | Showing ${start} to ${end}`);
  }, [allVehicles, currentPage]);

  return {
    cars,
    prices,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
