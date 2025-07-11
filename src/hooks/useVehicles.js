import { useState, useEffect } from "react";
import { getVehicleData, getLeaseData } from "../api/api";
import vehicleOptions from "../data/vehicleOptions.json";

const ENGINE_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid"];
const SEATERS = [5, 7];
const MIN_PRICE = 0;
const MAX_PRICE = 2000;
const PAGE_SIZE = 10;
const UI_PAGE_SIZE = 4; // How many cars to show per UI page


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
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [variants, setVariants] = useState([]);

  // Fetch cars when filters change
  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      let fetchCombos = [];
      const brands = filters.brand ? [filters.brand] : vehicleOptions.brands;
      const years = filters.yearGroup ? [filters.yearGroup] : vehicleOptions.years;
      for (const brand of brands) {
        const models = filters.model ? [filters.model] : (vehicleOptions.models?.[brand] || []);
        for (const model of models) {
          for (const yearGroup of years) {
            fetchCombos.push({ brand, model, yearGroup });
          }
        }
      }
      try {
        const results = await Promise.all(
          fetchCombos.map(combo => getVehicleData(combo))
        );
        const fetchedCars = results.flatMap(carData => Array.isArray(carData) ? carData : (carData ? [carData] : []));
        setCars(fetchedCars);
        setCurrentPage(1); // Reset to first page on new fetch
        // Extract unique variants for the current car set
        const uniqueVariants = Array.from(new Set(fetchedCars.map(car => car.variant).filter(Boolean)));
        setVariants(uniqueVariants);
      } catch (e) {
        setCars([]);
        setVariants([]);
        setCurrentPage(1);
      }
      setLoading(false);
    }
    fetchCars();
  }, [filters.brand, filters.model, filters.yearGroup]);

  // Fetch prices for cars
  useEffect(() => {
    if (!cars.length) return;
    setPrices({}); // Clear prices when cars change
    cars.forEach(async (car) => {
      const vehicle = {
        fuelCombined: car.fuelCombined ?? 5.6,
        fuelType: car.fuelType ?? "PULP",
        regServiceMonths: car.regServiceMonths ?? 12,
        vFactsSegment: car.vFactsSegment ?? "Large",
        vFactsClass: car.vFactsClass ?? "SUV",
        vehicleID: car.vehicleID ?? car.id ?? Math.floor(Math.random() * 100000),
        variant: car.variant ?? "Unknown",
        series: car.series ?? "Unknown",
        badgeDescription: car.badgeDescription ?? "Unknown",
        imageCode: car.imageCode ?? "",
        bodyStyle: car.bodyStyle ?? car.bodyType ?? "SUV",
        doors: car.doors ?? 5,
        engineDescription: car.engineDescription ?? "2.5",
        engineCylinders: car.engineCylinders ?? 4,
        engineTypeDescription: car.engineTypeDescription ?? car.engineType ?? "Piston - Electric",
        gears: car.gears ?? 6,
        gearTypeDescription: car.gearTypeDescription ?? car.transmission ?? "Constantly Variable Transmission",
        inductionDescription: car.inductionDescription ?? "Aspirated",
        isCurrentModel: car.isCurrentModel ?? true,
        isActive: car.isActive ?? true,
        maintenanceProfileType: car.maintenanceProfileType ?? "4cyl Standard 2wd 10k Service",
        powerPlantType: car.powerPlantType ?? "HEV",
        make: car.brand ?? car.make ?? "Toyota",
        model: car.model ?? "Unknown",
        yearGroup: car.yearGroup ?? 2025,
        fuelMetro: car.fuelMetro ?? 6,
        vehicleOptions: car.vehicleOptions ?? [],
        cO2Combined: car.cO2Combined ?? 128,
        vehicleType: car.vehicleType ?? "SUV",
        redBookID: car.redBookID ?? "",
        listPrice: car.listPrice ?? 85135,
        frontTyreSpecification: car.frontTyreSpecification ?? { size: "235/55 R20", replacementCost: 700, replacementInterval: 40000 },
        rearTyreSpecification: car.rearTyreSpecification ?? { size: "235/55 R20", replacementCost: 700, replacementInterval: 40000 },
        maintenanceProfile: car.maintenanceProfile ?? { name: "4cyl Standard 2wd 10k Service", majorServicePrice: 660 },
        firstServiceKm: car.firstServiceKm ?? 15000,
        regServiceKm: car.regServiceKm ?? 15000,
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
      try {
        const start = performance.now();
        const leaseData = await getLeaseData(payload);
        const end = performance.now();
        console.log(`getLeaseData for vehicleID ${vehicle.vehicleID} (${vehicle.make} ${vehicle.model} ${vehicle.yearGroup}) took ${(end - start).toFixed(1)}ms`);
        if (leaseData && Array.isArray(leaseData.periodicCalculations)) {
          const priceObj = {};
          ["Weekly", "Monthly", "Fortnightly"].forEach(period => {
            const found = leaseData.periodicCalculations.find(p => p.period === period);
            if (found && found.cost && found.cost.budget && typeof found.cost.budget.budgetTotal === 'number') {
              priceObj[period.toLowerCase()] = found.cost.budget.budgetTotal;
            }
          });
          // Update prices state incrementally
          setPrices(prev => ({ ...prev, [vehicle.vehicleID]: priceObj }));
        }
      } catch (e) {
        // ignore errors
      }
    });
  }, [cars]);

  // Filter cars client-side
  const filteredCars = cars.filter(car => {
    // Engine type filter
    if (filters.engineType && !((car.engineTypeDescription || car.engineType || "").toLowerCase().includes(filters.engineType.toLowerCase()))) return false;
    // Seater filter
    if (filters.seater && String(car.seats || car.seater || "") !== String(filters.seater)) return false;
    // Year filter (fix: compare as string)
    if (filters.yearGroup && String(car.yearGroup) !== String(filters.yearGroup)) return false;
    // Variant filter
    if (filters.variant && car.variant !== filters.variant) return false;
    // Price filter (fix: use weekly price)
    const priceObj = prices[car.vehicleID || car.id || car.model];
    if (filters.price && priceObj && priceObj.weekly && priceObj.weekly > filters.price) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / UI_PAGE_SIZE) || 1;
const paginatedCars = filteredCars.slice((currentPage - 1) * UI_PAGE_SIZE, currentPage * UI_PAGE_SIZE);


  return {
    cars: paginatedCars,
    prices,
    loading,
    filters,
    setFilters,
    options: {
      brands: vehicleOptions.brands,
      models: filters.brand ? vehicleOptions.models[filters.brand] : Object.values(vehicleOptions.models).flat(),
      years: vehicleOptions.years,
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