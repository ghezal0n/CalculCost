/**
 * Default fixed rates for all regions.
 * These are the fallback values when no admin override exists.
 */
export const DEFAULT_RATES = {
  antwerp: {
    label: "Antwerp (Belgium / Germany / Netherlands)",
    thcOrigin: 200.0,
    containerPreCollection: 255.0,
    stowage: 237.5,
    preCarriageNiederauer: 675.0,
    preCarriageDurenKreuzau: 540.0,
    tonWeight: 24,
  },
  hamburg: {
    label: "Hamburg",
    thcOrigin: 250.0,
    stowage: 650.0,
    preCarriageNiederauer: 675.0,
    tonWeight: 24,
  },
  spain: {
    label: "Spain (Barcelona / Valencia)",
    thcOrigin: 150.0,
    stowage: 400.0,
    preCarriageNiederauer: 500.0,
    tonWeight: 24,
  },
  koper: {
    label: "Slovenia (Koper)",
    thcOrigin: 150.0,
    stowage: 400.0,
    preCarriageNiederauer: 500.0,
    tonWeight: 24,
  },
  verzuolo: {
    label: "Italy (Verzuolo)",
    thcOrigin: 200.0,
    preCarriageToAntwerp: 425.0,
    lashingAndSecuring: 75.0,
    stuffingRate: 7.6,
    tonWeight: 24,
  },
  usa_savannah: {
    label: "USA — Savannah",
    handlingInOutDrayage: 890,
    tonWeight: 24,
  },
  usa_new_orleans: {
    label: "USA — New Orleans",
    handlingInOutDrayage: 800,
    drayagePortsOfAmerica: 235,
    tonWeight: 24,
  },
  usa_houston: {
    label: "USA — Houston",
    handlingInOutDrayagesChassis: 725,
    tonWeight: 24,
  },
};

const STORAGE_KEY = "adminRates";

/**
 * Returns merged rates: default + any admin overrides saved in localStorage.
 */
export const getRates = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_RATES;
    const overrides = JSON.parse(saved);
    const merged = {};
    for (const key of Object.keys(DEFAULT_RATES)) {
      merged[key] = { ...DEFAULT_RATES[key], ...(overrides[key] || {}) };
    }
    return merged;
  } catch {
    return DEFAULT_RATES;
  }
};

/**
 * Saves admin rate overrides to localStorage.
 * @param {object} rates - full rates object (same structure as DEFAULT_RATES)
 */
export const saveRates = (rates) => {
  // Only store values that differ from defaults to keep storage light
  const overrides = {};
  for (const key of Object.keys(DEFAULT_RATES)) {
    if (!rates[key]) continue;
    const diff = {};
    for (const field of Object.keys(rates[key])) {
      if (rates[key][field] !== DEFAULT_RATES[key]?.[field]) {
        diff[field] = rates[key][field];
      }
    }
    if (Object.keys(diff).length > 0) overrides[key] = diff;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

/**
 * Resets all admin overrides back to defaults.
 */
export const resetRates = () => {
  localStorage.removeItem(STORAGE_KEY);
};
