import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VALID_COMPARISON_KEYS = new Set([
  "capacityClass",
  "ratedCurrentIn",
  "breakingCapacity",
  "tripCurveCharacteristics",
  "numberOfPoles",
  "ratedVoltageUe",
  "ratedInsulationVoltageUi",
  "ratedImpulseWithstandVoltageUimp",
  "standardsApprovals",
  "mechanicalEndurance",
  "electricalEndurance",
  "widthPerPole",
  "serviceBreakingCapacityIcs"
]);

const REQUIRED_SEGMENT_KEYS = {
  residential: ["standardsApprovals", "breakingCapacity", "ratedCurrentIn"],
  industrial: ["standardsApprovals", "breakingCapacity", "serviceBreakingCapacityIcs"]
};

function addIssue(issues, message) {
  issues.push(message);
}

function resolveReferenceCount(product, references) {
  let count = 0;

  for (const reference of references) {
    if (reference.source === "comparison") {
      if (!reference.key) {
        continue;
      }
      const value = product.comparison?.[reference.key];
      if (value && value !== "N/A") {
        count += 1;
      }
      continue;
    }

    if (reference.source === "specification") {
      if (!reference.label) {
        continue;
      }
      const specification = product.specifications?.find((item) => item.label === reference.label);
      if (specification?.value && specification.value !== "N/A") {
        count += 1;
      }
    }
  }

  return count;
}

async function loadJson(filePath) {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateManufacturerDir(dataDir, issues) {
  const dirName = path.basename(dataDir);
  const segmentsPath = path.join(dataDir, "segments.json");

  if (!(await pathExists(segmentsPath))) {
    return { validated: false, segmentCount: 0, productCount: 0 };
  }

  const segments = await loadJson(segmentsPath);
  const segmentsWithRationale = segments.filter((segment) => Array.isArray(segment.rationaleTags) && segment.rationaleTags.length);

  if (!segmentsWithRationale.length) {
    return { validated: false, segmentCount: segments.length, productCount: 0 };
  }

  const files = await readdir(dataDir);
  const productFiles = files.filter(
    (name) => name.endsWith(".json") && name !== "segments.json" && !name.startsWith("._")
  );

  const products = [];
  for (const fileName of productFiles) {
    products.push(await loadJson(path.join(dataDir, fileName)));
  }

  const productsById = new Map();
  for (const product of products) {
    productsById.set(product.id, product);
  }

  for (const segment of segmentsWithRationale) {
    const segmentProducts = (segment.productIds ?? [])
      .map((productId) => productsById.get(productId))
      .filter(Boolean);

    if (!segmentProducts.length) {
      addIssue(issues, `dir=${dirName} segment=${segment.id} has no mapped products.`);
      continue;
    }

    const coveredComparisonKeys = new Set();

    for (const tag of segment.rationaleTags) {
      if (!tag.id || !tag.value || !tag.reasonJa) {
        addIssue(issues, `dir=${dirName} segment=${segment.id} has a tag missing id/value/reasonJa.`);
      }

      if (!Array.isArray(tag.evidenceRefs) || !tag.evidenceRefs.length) {
        addIssue(issues, `dir=${dirName} segment=${segment.id} tag=${tag.id ?? "unknown"} is missing evidenceRefs.`);
        continue;
      }

      for (const reference of tag.evidenceRefs) {
        if (reference.source === "comparison") {
          if (!reference.key) {
            addIssue(issues, `dir=${dirName} segment=${segment.id} tag=${tag.id} comparison reference is missing key.`);
            continue;
          }
          if (!VALID_COMPARISON_KEYS.has(reference.key)) {
            addIssue(issues, `dir=${dirName} segment=${segment.id} tag=${tag.id} uses invalid comparison key=${reference.key}.`);
            continue;
          }
          coveredComparisonKeys.add(reference.key);
          continue;
        }

        if (reference.source === "specification") {
          if (!reference.label) {
            addIssue(issues, `dir=${dirName} segment=${segment.id} tag=${tag.id} specification reference is missing label.`);
            continue;
          }

          const existsInSegment = segmentProducts.some((product) =>
            product.specifications?.some((specification) => specification.label === reference.label)
          );

          if (!existsInSegment) {
            addIssue(
              issues,
              `dir=${dirName} segment=${segment.id} tag=${tag.id} references unknown specification label='${reference.label}'.`
            );
          }
        }
      }
    }

    const requiredKeys = REQUIRED_SEGMENT_KEYS[segment.id] ?? [];
    for (const requiredKey of requiredKeys) {
      if (!coveredComparisonKeys.has(requiredKey)) {
        addIssue(issues, `dir=${dirName} segment=${segment.id} is missing required evidence for comparison key=${requiredKey}.`);
      }
    }

    for (const product of segmentProducts) {
      let resolvedCount = 0;
      for (const tag of segment.rationaleTags) {
        resolvedCount += resolveReferenceCount(product, tag.evidenceRefs ?? []);
      }

      if (resolvedCount === 0) {
        addIssue(issues, `dir=${dirName} product=${product.id} does not resolve any rationale evidence.`);
      }
    }
  }

  return {
    validated: true,
    segmentCount: segmentsWithRationale.length,
    productCount: products.length
  };
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, "..");
  const dataRoot = path.join(repoRoot, "src", "data");
  const dataDirs = (await readdir(dataRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataRoot, entry.name));

  const issues = [];
  let validatedSegments = 0;
  let validatedProducts = 0;

  for (const dataDir of dataDirs) {
    const result = await validateManufacturerDir(dataDir, issues);
    if (result.validated) {
      validatedSegments += result.segmentCount;
      validatedProducts += result.productCount;
    }
  }

  if (issues.length) {
    console.error(`[validate:rationale-data] NG: ${issues.length} issues`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[validate:rationale-data] OK: ${validatedSegments} segments, ${validatedProducts} products`);
}

main().catch((error) => {
  console.error(`[validate:rationale-data] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
