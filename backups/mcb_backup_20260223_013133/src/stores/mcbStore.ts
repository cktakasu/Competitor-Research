"use client";

import { create } from "zustand";
import { getManufacturers } from "../services/dataService";
import type { ManufacturerId } from "../types/mcb";

const MAX_COMPARE_PRODUCTS = 5;

type McbStore = {
  selectedManufacturerId: ManufacturerId;
  expandedSegmentIds: string[];
  comparedProductIds: string[];
  selectManufacturer: (manufacturerId: ManufacturerId) => void;
  toggleSegment: (segmentId: string) => void;
  setExpandedSegments: (segmentIds: string[]) => void;
  addComparedProduct: (productId: string) => void;
  removeComparedProduct: (productId: string) => void;
  clearComparedProducts: () => void;
};

const manufacturers = getManufacturers();
const defaultManufacturer =
  manufacturers.find((manufacturer) => manufacturer.enabled)?.id ?? "schneider-electric";

export const useMcbStore = create<McbStore>((set) => ({
  selectedManufacturerId: defaultManufacturer,
  expandedSegmentIds: [],
  comparedProductIds: [],
  selectManufacturer: (manufacturerId) => {
    set({ selectedManufacturerId: manufacturerId, expandedSegmentIds: [] });
  },
  toggleSegment: (segmentId) => {
    set((state) => {
      const expanded = state.expandedSegmentIds.includes(segmentId)
        ? state.expandedSegmentIds.filter((id) => id !== segmentId)
        : [...state.expandedSegmentIds, segmentId];

      return { expandedSegmentIds: expanded };
    });
  },
  setExpandedSegments: (segmentIds) => {
    set({ expandedSegmentIds: [...new Set(segmentIds)] });
  },
  addComparedProduct: (productId) => {
    set((state) => {
      if (state.comparedProductIds.includes(productId)) {
        return state;
      }

      if (state.comparedProductIds.length >= MAX_COMPARE_PRODUCTS) {
        return state;
      }

      return { comparedProductIds: [...state.comparedProductIds, productId] };
    });
  },
  removeComparedProduct: (productId) => {
    set((state) => ({
      comparedProductIds: state.comparedProductIds.filter((id) => id !== productId)
    }));
  },
  clearComparedProducts: () => {
    set({ comparedProductIds: [] });
  }
}));

export { MAX_COMPARE_PRODUCTS };
