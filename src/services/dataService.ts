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

const EMPTY_PRODUCTS: McbProduct[] = [];
const EMPTY_SEGMENTS: McbSegment[] = [];

const productsByManufacturer = new Map<ManufacturerId, McbProduct[]>();
const productsBySegment = new Map<string, McbProduct[]>();
const productById = new Map<string, McbProduct>();
const segmentsByManufacturer = new Map<ManufacturerId, McbSegment[]>();
const segmentById = new Map<string, McbSegment>();

for (const manufacturer of manufacturers) {
  productsByManufacturer.set(manufacturer.id, []);
  segmentsByManufacturer.set(manufacturer.id, []);
}

for (const product of products) {
  const byMaker = productsByManufacturer.get(product.manufacturerId);
  if (byMaker) {
    byMaker.push(product);
  }
  const segmentKey = `${product.manufacturerId}::${product.segmentId}`;
  const bySegment = productsBySegment.get(segmentKey);
  if (bySegment) {
    bySegment.push(product);
  } else {
    productsBySegment.set(segmentKey, [product]);
  }
  productById.set(product.id, product);
}

for (const segment of segments) {
  const byMaker = segmentsByManufacturer.get(segment.manufacturerId);
  if (byMaker) {
    byMaker.push(segment);
  }
  segmentById.set(`${segment.manufacturerId}::${segment.id}`, segment);
}

export function getManufacturers(): Manufacturer[] {
  return manufacturers;
}

export function getSegmentsByManufacturer(manufacturerId: ManufacturerId): McbSegment[] {
  return segmentsByManufacturer.get(manufacturerId) ?? EMPTY_SEGMENTS;
}

export function getProductsByManufacturer(manufacturerId: ManufacturerId): McbProduct[] {
  return productsByManufacturer.get(manufacturerId) ?? EMPTY_PRODUCTS;
}

export function getProductsBySegment(manufacturerId: ManufacturerId, segmentId: string): McbProduct[] {
  return productsBySegment.get(`${manufacturerId}::${segmentId}`) ?? EMPTY_PRODUCTS;
}

export function getSegmentById(manufacturerId: ManufacturerId, segmentId: string): McbSegment | undefined {
  return segmentById.get(`${manufacturerId}::${segmentId}`);
}

export function getProductById(productId: string): McbProduct | undefined {
  return productById.get(productId);
}
