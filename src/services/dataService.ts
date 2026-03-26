import manufacturersData from "../data/manufacturers.json";
import { getManufacturerCatalog, manufacturerCatalogs } from "../data/catalog";
import type { Manufacturer, ManufacturerId, McbProduct, McbSegment } from "../types/mcb";

const manufacturers = manufacturersData as Manufacturer[];
const segments = Object.values(manufacturerCatalogs).flatMap((catalog) => catalog.segments);
const products = Object.values(manufacturerCatalogs).flatMap((catalog) => catalog.products);

const EMPTY_PRODUCTS: McbProduct[] = [];
const EMPTY_SEGMENTS: McbSegment[] = [];

const productsByManufacturer = new Map<ManufacturerId, McbProduct[]>();
const productsBySegment = new Map<string, McbProduct[]>();
const productById = new Map<string, McbProduct>();
const segmentsByManufacturer = new Map<ManufacturerId, McbSegment[]>();
const segmentById = new Map<string, McbSegment>();

const initializeData = () => {
  manufacturers.forEach((manufacturer) => {
    const catalog = getManufacturerCatalog(manufacturer.id);
    productsByManufacturer.set(manufacturer.id, [...catalog.products]);
    segmentsByManufacturer.set(manufacturer.id, [...catalog.segments]);
  });

  products.forEach((product) => {
    productById.set(product.id, product);
  });

  segments.forEach((segment) => {
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
