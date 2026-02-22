export type ManufacturerId = "schneider-electric" | "abb" | "siemens" | "eaton" | "ls-electric";

export type ComparisonRowKey =
  | "capacityClass"
  | "ratedCurrentIn"
  | "breakingCapacity"
  | "tripCurveCharacteristics"
  | "numberOfPoles"
  | "ratedVoltageUe"
  | "ratedInsulationVoltageUi"
  | "standardsApprovals"
  | "widthPerPole"
  | "serviceBreakingCapacityIcs";

export type Manufacturer = {
  id: ManufacturerId;
  name: string;
  logoUrl: string;
  enabled: boolean;
  statusLabel: string;
};

export type RationaleEvidenceRef = {
  source: "comparison" | "specification";
  key?: ComparisonRowKey;
  label?: string;
  noteJa?: string;
};

export type RationaleTag = {
  id: string;
  value: string;
  reasonJa: string;
  evidenceRefs: RationaleEvidenceRef[];
};

export type McbSegment = {
  id: string;
  manufacturerId: ManufacturerId;
  name: string;
  icon: string;
  productIds: string[];
  rationaleTags: RationaleTag[];
};

export type ProductComparisonSpecs = {
  capacityClass: string;
  ratedCurrentIn: string;
  breakingCapacity: string;
  tripCurveCharacteristics: string;
  numberOfPoles: string;
  ratedVoltageUe: string;
  ratedInsulationVoltageUi: string;
  standardsApprovals: string;
  widthPerPole: string;
  serviceBreakingCapacityIcs: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type McbProduct = {
  id: string;
  manufacturerId: ManufacturerId;
  segmentId: string;
  series: string;
  comparison: ProductComparisonSpecs;
  specifications: ProductSpecification[];
};

export const COMPARISON_ROWS: Array<{ key: ComparisonRowKey; label: string }> = [
  { key: "capacityClass", label: "Capacity Class" },
  { key: "ratedCurrentIn", label: "Rated Current (In)" },
  { key: "breakingCapacity", label: "Breaking Capacity (Icu / Icn)" },
  { key: "tripCurveCharacteristics", label: "Trip Curve Characteristics" },
  { key: "numberOfPoles", label: "Number of Poles" },
  { key: "ratedVoltageUe", label: "Rated Voltage (Ue)" },
  { key: "ratedInsulationVoltageUi", label: "Rated Insulation Voltage (Ui)" },
  { key: "standardsApprovals", label: "Standards / Approvals" },
  { key: "widthPerPole", label: "Width per Pole" },
  { key: "serviceBreakingCapacityIcs", label: "Service Breaking Capacity (Ics)" }
];
