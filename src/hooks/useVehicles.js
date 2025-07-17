import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getVehicleData, getLeaseData, getBrands, getModels } from "../api/api";

const ENGINE_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid"];
const SEATERS = [5, 7];
const MIN_PRICE = 0;
const MAX_PRICE = 2000;
const UI_PAGE_SIZE = 4;
const BATCH_SIZE = 10;
const CONCURRENT_BATCHES = 50;
const LEASE_THROTTLE = Math.min(navigator?.hardwareConcurrency || 4, 8);
const INITIAL_PAGES_TO_LOAD = 6;

// 🔒 Hardcoded fallback for initial load
const HARDCODED_DATA = {
  brands: ["Toyota", "Tesla"],
  models: {
    Toyota: ["Kluger", "Camry", "Fortuner"],
    Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  },
  years: ["2024", "2025"],
};

export default function useVehicles() {
  const filters = useSelector((state) => state.filters);
  const [allCars, setAllCars] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [variants, setVariants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modelsMap, setModelsMap] = useState({});
  const [loadedCombosIndex, setLoadedCombosIndex] = useState(0);
  const combosRef = useRef([]);

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
            } catch {
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
    async function prepareCombos() {
      setLoading(true);

      const preferredYears = ["2024", "2025"];
      let yearsToUse = filters.yearGroup ? [filters.yearGroup] : preferredYears;
      let selectedBrands = filters.brand ? [filters.brand] : HARDCODED_DATA.brands;
      let modelsData = {};

      if (filters.brand) {
        try {
          const brandModels = await getModels({ make: filters.brand });
          modelsData[filters.brand] = brandModels;
        } catch {
          modelsData[filters.brand] = [];
        }
      } else {
        modelsData = HARDCODED_DATA.models;
      }

      let combos = [];

      for (const brand of selectedBrands) {
        const modelsToUse = filters.model ? [filters.model] : modelsData[brand] || [];
        for (const model of modelsToUse) {
          for (const yearGroup of yearsToUse) {
            combos.push({ brand, model, yearGroup });
          }
        }
      }

      combosRef.current = combos;
      setAllCars([]);
      setPrices({});
      setVariants([]);
      setLoadedCombosIndex(0);

      await fetchNextBatches(INITIAL_PAGES_TO_LOAD);

      const fallbackTimeout = setTimeout(async () => {
        if (allCars.length === 0 && !filters.yearGroup) {
          // Try again with all years if nothing came back for preferred years
          let fallbackCombos = [];
          for (const brand of selectedBrands) {
            const modelsToUse = filters.model ? [filters.model] : modelsData[brand] || [];
            for (const model of modelsToUse) {
              fallbackCombos.push({ brand, model });
            }
          }

          const yearVariants = ["2023", "2022", "2021", "2020"];
          const newCombos = [];
          fallbackCombos.forEach(combo => {
            yearVariants.forEach(yearGroup => {
              newCombos.push({ ...combo, yearGroup });
            });
          });

          combosRef.current = newCombos;
          setAllCars([]);
          setPrices({});
          setVariants([]);
          setLoadedCombosIndex(0);

          await fetchNextBatches(INITIAL_PAGES_TO_LOAD);
        }
      }, 2000);

      const checkPricesInterval = setInterval(() => {
        const allRelevantCars = allCars.filter((car) =>
          combosRef.current.some(
            (combo) =>
              car.brand === combo.brand &&
              car.model === combo.model &&
              String(car.yearGroup) === String(combo.yearGroup)
          )
        );

        const allLeasePricesLoaded = allRelevantCars.every((car) => {
          const id = car.vehicleID || car.id || car.model;
          return prices[id]?.weekly != null;
        });

        if (allLeasePricesLoaded || combosRef.current.length === 0) {
          clearInterval(checkPricesInterval);
          clearTimeout(fallbackTimeout);
          setLoading(false);
        }
      }, 300);
    }

    prepareCombos();
  }, [filters.brand, filters.model, filters.variant, filters.yearGroup]);

  useEffect(() => {
    if (currentPage >= totalPages - 1 && loadedCombosIndex < combosRef.current.length) {
      fetchNextBatches(1);
    }
  }, [currentPage]);

  const fetchNextBatches = async (pagesToFetch = 1) => {
    const combos = combosRef.current;
    const combosPerPage = UI_PAGE_SIZE;
    const combosToFetch = pagesToFetch * combosPerPage;
    const startIndex = loadedCombosIndex;
    const endIndex = Math.min(startIndex + combosToFetch, combos.length);
    const batches = [];

    for (let i = startIndex; i < endIndex; i += BATCH_SIZE) {
      batches.push(combos.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
      const batchGroup = batches.slice(i, i + CONCURRENT_BATCHES);
      await Promise.all(batchGroup.map(processBatch));
    }

    setLoadedCombosIndex(endIndex);
  };

  const processBatch = async (batch) => {
    const results = await Promise.allSettled(batch.map(combo => getVehicleData(combo)));
    let batchCars = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        const data = result.value;
        if (Array.isArray(data)) batchCars.push(...data);
        else if (data) batchCars.push(data);
      }
    }

    setAllCars(prev => {
      const updated = [...prev, ...batchCars];
      const uniqueVariants = Array.from(new Set(updated.map(car => car.variant).filter(Boolean)));
      setVariants(uniqueVariants);
      return updated;
    });

    processLeasePrices(batchCars);
  };

  async function processLeasePrices(carsBatch) {
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
                setPrices((prev) => ({ ...prev, [vehicle.vehicleID]: priceObj }));
              }
            }
          } catch (e) {
            // ignore invalid lease data
          }
        })
      );
    }
  }

  const filteredCars = allCars.filter((car) => {
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
  const start = (currentPage - 1) * UI_PAGE_SIZE;
  const end = start + UI_PAGE_SIZE;
  const paginatedCars = filteredCars.slice(start, end);

  return {
    cars: paginatedCars,
    prices,
    loading,
    filters,
    options: {
      brands,
      models: filters.brand ? modelsMap[filters.brand] || [] : [],
      years: HARDCODED_DATA.years,
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
