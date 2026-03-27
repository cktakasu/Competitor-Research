import abbSegmentsData from "./abb/segments.json";
import schneiderSegmentsData from "./schneider/segments.json";
import lsSegmentsData from "./ls-electric/segments.json";
import eatonSegmentsData from "./eaton/segments.json";

import abbS200Data from "./abb/abb-s200.json";
import abbSn201Data from "./abb/abb-sn201.json";
import abbS300PData from "./abb/abb-s300-p.json";
import abbS800Data from "./abb/abb-s800.json";
import abbSu200Data from "./abb/abb-su200.json";
import abbS800PvSpData from "./abb/abb-s800pv-sp.json";

import acti9Ic60hData from "./schneider/acti9-ic60h.json";
import acti9Ic60hDcData from "./schneider/acti9-ic60h-dc.json";
import acti9Ic60lData from "./schneider/acti9-ic60l.json";
import acti9Ic60nData from "./schneider/acti9-ic60n.json";
import acti9Ic60nDcData from "./schneider/acti9-ic60n-dc.json";
import easy9Data from "./schneider/easy9.json";
import easy9ProData from "./schneider/easy9-pro.json";
import domaeData from "./schneider/domae.json";
import multi9C60bpData from "./schneider/multi9-c60bp.json";
import multi9C60hDcData from "./schneider/multi9-c60h-dc.json";
import multi9C60spData from "./schneider/multi9-c60sp.json";
import resi9Data from "./schneider/resi9.json";

import bknData from "./ls-electric/bkn.json";
import bk63nData from "./ls-electric/bk63n.json";
import bk125hData from "./ls-electric/bk125h.json";
import eatonPl6Data from "./eaton/pl6.json";
import eatonPl7Data from "./eaton/pl7.json";
import eatonPlhtData from "./eaton/plht.json";
import eatonFazData from "./eaton/faz.json";
import eatonFazDcData from "./eaton/faz-dc.json";

import type { ManufacturerId, McbProduct, McbSegment } from "../types/mcb";

export type ManufacturerCatalog = {
  products: McbProduct[];
  segments: McbSegment[];
};

const EMPTY_CATALOG: ManufacturerCatalog = {
  products: [],
  segments: []
};

export const manufacturerCatalogs: Record<ManufacturerId, ManufacturerCatalog> = {
  abb: {
    products: [
      abbS200Data,
      abbSn201Data,
      abbS300PData,
      abbS800Data,
      abbSu200Data,
      abbS800PvSpData
    ] as McbProduct[],
    segments: abbSegmentsData as McbSegment[]
  },
  "schneider-electric": {
    products: [
      resi9Data,
      easy9Data,
      easy9ProData,
      domaeData,
      acti9Ic60nData,
      acti9Ic60hData,
      acti9Ic60lData,
      multi9C60bpData,
      multi9C60spData,
      multi9C60hDcData,
      acti9Ic60nDcData,
      acti9Ic60hDcData
    ] as McbProduct[],
    segments: schneiderSegmentsData as McbSegment[]
  },
  "ls-electric": {
    products: [bknData, bk63nData, bk125hData] as McbProduct[],
    segments: lsSegmentsData as McbSegment[]
  },
  siemens: EMPTY_CATALOG,
  eaton: {
    products: [eatonPl6Data, eatonPl7Data, eatonPlhtData, eatonFazData, eatonFazDcData] as McbProduct[],
    segments: eatonSegmentsData as McbSegment[]
  }
};

export function getManufacturerCatalog(manufacturerId: ManufacturerId): ManufacturerCatalog {
  return manufacturerCatalogs[manufacturerId] ?? EMPTY_CATALOG;
}
