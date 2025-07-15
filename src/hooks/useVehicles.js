import { useState, useEffect } from "react";
import { getVehicleData, getLeaseData, getBrands, getModels } from "../api/api";

const ENGINE_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid"];
const SEATERS = [5, 7];
const MIN_PRICE = 0;
const MAX_PRICE = 2000;
const UI_PAGE_SIZE = 4;

export default function useVehicles() {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    yearGroup: "",
    engineType: "",
    seater: "",
    price: MAX_PRICE,
    variant: "",
  });
  const [cars, setCars] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [variants, setVariants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modelsMap, setModelsMap] = useState({});

  useEffect(() => {
    async function loadOptions() {
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands);
        const modelsByBrand = {};
        await Promise.all(
          fetchedBrands.map(async (brand) => {
            try {
              const models = await getModels({ make: brand });
              modelsByBrand[brand] = models;
            } catch (e) {
              modelsByBrand[brand] = [];
            }
          })
        );
        setModelsMap(modelsByBrand);
      } catch (e) {
        console.error("Failed to load brand/model options", e);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    let cancel = false;

    async function fetchCars() {
      setLoading(true);
      const brandsToUse = filters.brand ? [filters.brand] : brands;
      const years = filters.yearGroup ? [filters.yearGroup] : [2024, 2025];

      let combos = [];
      for (const brand of brandsToUse) {
        const models = filters.model ? [filters.model] : modelsMap?.[brand] || [];
        for (const model of models) {
          for (const yearGroup of years) {
            combos.push({ brand, model, yearGroup });
          }
        }
      }

      const BATCH_SIZE = 50;
      setCars([]);
      setPrices({});

      for (let i = 0; i < combos.length; i += BATCH_SIZE) {
        if (cancel) break;
        const batch = combos.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map((combo) => getVehicleData(combo))
        );

        let batchCars = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            const data = result.value;
            if (Array.isArray(data)) batchCars.push(...data);
            else if (data) batchCars.push(data);
          }
        }

        setCars((prev) => {
          const updated = [...prev, ...batchCars];
          const uniqueVariants = Array.from(
            new Set(updated.map((car) => car.variant).filter(Boolean))
          );
          setVariants(uniqueVariants);
          return updated;
        });

        processLeasePrices(batchCars); // fire-and-forget

        if (i === 0) setLoading(false);
      }
    }

    async function processLeasePrices(carsBatch) {
      const THROTTLE = 10;
      for (let i = 0; i < carsBatch.length; i += THROTTLE) {
        const slice = carsBatch.slice(i, i + THROTTLE);
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
                  setPrices((prev) => ({ ...prev, [vehicle.vehicleID]: priceObj }));
                }
              }
            } catch (e) {
              // silently ignore cars with bad lease data
            }
          })
        );
      }
    }

    if (brands.length && Object.keys(modelsMap).length) fetchCars();
    return () => {
      cancel = true;
    };
  }, [filters.brand, filters.model, filters.yearGroup, brands, modelsMap]);

  const filteredCars = cars.filter((car) => {
    const priceObj = prices[car.vehicleID || car.id || car.model];
    if (!priceObj || !priceObj.weekly) return false;
    if (filters.engineType && !(car.engineTypeDescription || "").toLowerCase().includes(filters.engineType.toLowerCase())) return false;
    if (filters.seater && String(car.seats || car.seater || "") !== String(filters.seater)) return false;
    if (filters.yearGroup && String(car.yearGroup) !== String(filters.yearGroup)) return false;
    if (filters.variant && car.variant !== filters.variant) return false;
    if (filters.price < MAX_PRICE && priceObj?.weekly > filters.price) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCars.length / UI_PAGE_SIZE) || 1;
  const paginatedCars = filteredCars.slice((currentPage - 1) * UI_PAGE_SIZE, currentPage * UI_PAGE_SIZE);

  return {
    cars: paginatedCars,
    prices,
    loading,
    filters,
    setFilters,
    options: {
      brands,
      models: filters.brand ? modelsMap[filters.brand] || [] : [],
      years: [2024, 2025],
      engineTypes: ENGINE_TYPES,
      seaters: SEATERS,
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      variants,
    },
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
