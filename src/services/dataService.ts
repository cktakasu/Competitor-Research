import manufacturersData from "../data/manufacturers.json";
import segmentsData from "../data/schneider/segments.json";
import acti9Ic60hData from "../data/schneider/acti9-ic60h.json";
import acti9Ic60hDcData from "../data/schneider/acti9-ic60h-dc.json";
import acti9Ic60lData from "../data/schneider/acti9-ic60l.json";
import acti9Ic60nData from "../data/schneider/acti9-ic60n.json";
import acti9Ic60nDcData from "../data/schneider/acti9-ic60n-dc.json";
import easy9Data from "../data/schneider/easy9.json";
import multi9C60bpData from "../data/schneider/multi9-c60bp.json";
import multi9C60hDcData from "../data/schneider/multi9-c60h-dc.json";
import multi9C60spData from "../data/schneider/multi9-c60sp.json";
import resi9Data from "../data/schneider/resi9.json";
import type { Manufacturer, ManufacturerId, McbProduct, McbSegment } from "../types/mcb";

const manufacturers = manufacturersData as Manufacturer[];
const segments = segmentsData as McbSegment[];

const products = [
  resi9Data,
  easy9Data,
  acti9Ic60nData,
  acti9Ic60hData,
  acti9Ic60lData,
  multi9C60bpData,
  multi9C60spData,
  multi9C60hDcData,
  acti9Ic60nDcData,
  acti9Ic60hDcData
] as McbProduct[];

export function getManufacturers(): Manufacturer[] {
  return manufacturers;
}

export function getSegmentsByManufacturer(manufacturerId: ManufacturerId): McbSegment[] {
  return segments.filter((segment) => segment.manufacturerId === manufacturerId);
}

export function getProductsByManufacturer(manufacturerId: ManufacturerId): McbProduct[] {
  return products.filter((product) => product.manufacturerId === manufacturerId);
}

export function getProductsBySegment(manufacturerId: ManufacturerId, segmentId: string): McbProduct[] {
  return products.filter(
    (product) => product.manufacturerId === manufacturerId && product.segmentId === segmentId
  );
}

export function getProductById(productId: string): McbProduct | undefined {
  return products.find((product) => product.id === productId);
}
