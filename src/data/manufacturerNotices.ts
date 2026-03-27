import type { ManufacturerId } from "../types/mcb";

export type ManufacturerNotice = {
  title: string;
  tone?: "info" | "caution";
  body: string[];
};

export const manufacturerNotices: Partial<Record<ManufacturerId, ManufacturerNotice>> = {
  eaton: {
    title: "Coverage Note",
    tone: "caution",
    body: [
      "Eaton does not currently include an officially confirmed PV / renewables MCB line on this page.",
      "Official Eaton PV protection products sit outside the MCB category, and Eaton DC MCB lines are not for PV string protection."
    ]
  }
};
