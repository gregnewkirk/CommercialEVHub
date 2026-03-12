export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
] as const;

export const ELIGIBLE_ENTITIES = [
  { value: "commercial_fleet", label: "Commercial Fleet" },
  { value: "municipality", label: "Municipality" },
  { value: "school_district", label: "School District" },
  { value: "transit_agency", label: "Transit Agency" },
  { value: "commercial_real_estate", label: "Commercial Real Estate" },
  { value: "multi_unit_dwelling", label: "Multi-Unit Dwelling (MUD)" },
  { value: "workplace", label: "Workplace" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "tribal", label: "Tribal Government" },
] as const;

export const HARDWARE_TYPES = [
  { value: "level_1", label: "Level 1 (120V)" },
  { value: "level_2", label: "Level 2 (240V AC)" },
  { value: "dcfc", label: "DC Fast Charging (50kW+)" },
] as const;

export const INCENTIVE_TYPES = [
  { value: "grant", label: "Direct Grant" },
  { value: "tax_credit", label: "Tax Credit" },
  { value: "rebate", label: "Utility Rebate" },
  { value: "make_ready", label: "Make-Ready Infrastructure" },
] as const;

export const JURISDICTIONS = [
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "county", label: "County" },
  { value: "city", label: "City" },
  { value: "utility", label: "Utility" },
] as const;

export function getStateByCode(code: string) {
  return US_STATES.find((s) => s.code === code.toUpperCase());
}

export function getEntityLabel(value: string) {
  return ELIGIBLE_ENTITIES.find((e) => e.value === value)?.label ?? value;
}

export function getHardwareLabel(value: string) {
  return HARDWARE_TYPES.find((h) => h.value === value)?.label ?? value;
}

export function getIncentiveLabel(value: string) {
  return INCENTIVE_TYPES.find((i) => i.value === value)?.label ?? value;
}

export function getJurisdictionLabel(value: string) {
  return JURISDICTIONS.find((j) => j.value === value)?.label ?? value;
}
