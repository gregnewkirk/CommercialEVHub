export interface ROIInput {
  numPorts: number;
  chargingLevel: "level2" | "dcfc";
  grantSubsidy: number; // dollars
  taxCredit30C: boolean;
  dailySessions: number;
  feePerSession: number; // dollars
  electricityRate: number; // $/kWh
  demandCharge: number; // $/kW-month
}

export interface ROIOutput {
  grossCapex: number; // dollars
  grantOffset: number;
  taxCreditOffset: number;
  netInvestment: number;
  annualRevenue: number;
  annualOpex: number;
  annualProfit: number;
  roiPercent: number; // 5-year ROI %
  paybackYears: number;
}

const HARDWARE_COST = {
  level2: 5000, // $ per port
  dcfc: 95000,
};

const KW_PER_PORT = {
  level2: 19.2,
  dcfc: 150,
};

const KWH_PER_SESSION = {
  level2: 30,
  dcfc: 40,
};

const SOFTWARE_PER_PORT_MONTH = 20; // $/port/month

export function computeROI(input: ROIInput): ROIOutput {
  const {
    numPorts,
    chargingLevel,
    grantSubsidy,
    taxCredit30C,
    dailySessions,
    feePerSession,
    electricityRate,
    demandCharge,
  } = input;

  // CapEx
  const grossCapex = numPorts * HARDWARE_COST[chargingLevel];

  // Grant offset
  const grantOffset = Math.min(grantSubsidy, grossCapex);

  // 30C tax credit: 30% of hardware cost, max $100,000 per property
  const taxCreditOffset = taxCredit30C
    ? Math.min(grossCapex * 0.3, 100000)
    : 0;

  // Net investment
  const netInvestment = Math.max(grossCapex - grantOffset - taxCreditOffset, 0);

  // Annual revenue
  const annualRevenue = dailySessions * 365 * feePerSession * numPorts;

  // Annual OpEx
  const kwhPerDay = dailySessions * KWH_PER_SESSION[chargingLevel] * numPorts;
  const annualElectricity = kwhPerDay * 365 * electricityRate;
  const annualDemandCharges = KW_PER_PORT[chargingLevel] * numPorts * 12 * demandCharge;
  const annualSoftware = numPorts * SOFTWARE_PER_PORT_MONTH * 12;
  const annualOpex = annualElectricity + annualDemandCharges + annualSoftware;

  // Profit
  const annualProfit = annualRevenue - annualOpex;

  // 5-year ROI
  const roiPercent = netInvestment > 0
    ? ((annualProfit * 5) / netInvestment) * 100
    : annualProfit > 0 ? 999 : 0;

  // Payback period
  const paybackYears = annualProfit > 0
    ? netInvestment / annualProfit
    : Infinity;

  return {
    grossCapex,
    grantOffset,
    taxCreditOffset,
    netInvestment,
    annualRevenue,
    annualOpex,
    annualProfit,
    roiPercent: Math.round(roiPercent),
    paybackYears: Math.round(paybackYears * 10) / 10,
  };
}
