import manufacturersData from "../data/manufacturers.json";
import schneiderSegmentsData from "../data/schneider/segments.json";
import lsSegmentsData from "../data/ls-electric/segments.json";

import acti9Ic60hData from "../data/schneider/acti9-ic60h.json";
import acti9Ic60hDcData from "../data/schneider/acti9-ic60h-dc.json";
import acti9Ic60lData from "../data/schneider/acti9-ic60l.json";
import acti9Ic60nData from "../data/schneider/acti9-ic60n.json";
import acti9Ic60nDcData from "../data/schneider/acti9-ic60n-dc.json";
import easy9Data from "../data/schneider/easy9.json";
import easy9ProData from "../data/schneider/easy9-pro.json";
import domaeData from "../data/schneider/domae.json";
import multi9C60bpData from "../data/schneider/multi9-c60bp.json";
import multi9C60hDcData from "../data/schneider/multi9-c60h-dc.json";
import multi9C60spData from "../data/schneider/multi9-c60sp.json";
import resi9Data from "../data/schneider/resi9.json";

import bknData from "../data/ls-electric/bkn.json";
import bk63nData from "../data/ls-electric/bk63n.json";
import bk125hData from "../data/ls-electric/bk125h.json";

import type { Manufacturer, ManufacturerId, McbProduct, McbSegment } from "../types/mcb";

const manufacturers = manufacturersData as Manufacturer[];
const segments = [...(schneiderSegmentsData as McbSegment[]), ...(lsSegmentsData as McbSegment[])];

const products = [
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
  acti9Ic60hDcData,
  bknData,
  bk63nData,
  bk125hData
] as McbProduct[];

const EMPTY_PRODUCTS: McbProduct[] = [];
const EMPTY_SEGMENTS: McbSegment[] = [];

const productsByManufacturer = new Map<ManufacturerId, McbProduct[]>();
const productsBySegment = new Map<string, McbProduct[]>();
const productById = new Map<string, McbProduct>();
const segmentsByManufacturer = new Map<ManufacturerId, McbSegment[]>();
const segmentById = new Map<string, McbSegment>();

const initializeData = () => {
  manufacturers.forEach((m) => {
    productsByManufacturer.set(m.id, []);
    segmentsByManufacturer.set(m.id, []);
  });

  products.forEach((product) => {
    productsByManufacturer.get(product.manufacturerId)?.push(product);

    productById.set(product.id, product);
  });

  segments.forEach((segment) => {
    segmentsByManufacturer.get(segment.manufacturerId)?.push(segment);
    segmentById.set(`${segment.manufacturerId}::${segment.id}`, segment);

    productsBySegment.set(
      `${segment.manufacturerId}::${segment.id}`,
      segment.productIds
        .map((productId) => productById.get(productId))
        .filter((product): product is McbProduct => Boolean(product))
    );
  });
};

initializeData();

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
