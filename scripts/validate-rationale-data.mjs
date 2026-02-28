import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VALID_COMPARISON_KEYS = new Set([
  "ratedCurrentIn",
  "breakingCapacity",
  "tripCurveCharacteristics",
  "numberOfPoles",
  "ratedVoltageUe",
  "ratedInsulationVoltageUi",
  "standardsApprovals",
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

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, "..");
  const schneiderDir = path.join(repoRoot, "src", "data", "schneider");

  const segmentsPath = path.join(schneiderDir, "segments.json");
  const segments = await loadJson(segmentsPath);

  const files = await readdir(schneiderDir);
  const productFiles = files.filter(
    (name) => name.endsWith(".json") && name !== "segments.json" && !name.startsWith("._")
  );

  const products = [];
  for (const fileName of productFiles) {
    products.push(await loadJson(path.join(schneiderDir, fileName)));
  }

  const productsBySegmentId = new Map();
  for (const product of products) {
    const list = productsBySegmentId.get(product.segmentId) ?? [];
    list.push(product);
    productsBySegmentId.set(product.segmentId, list);
  }

  const issues = [];

  for (const segment of segments) {
    const segmentProducts = productsBySegmentId.get(segment.id) ?? [];

    if (!segmentProducts.length) {
      addIssue(issues, `segment=${segment.id} に紐づく製品が存在しません。`);
      continue;
    }

    if (!Array.isArray(segment.rationaleTags) || !segment.rationaleTags.length) {
      addIssue(issues, `segment=${segment.id} の rationaleTags が空です。`);
      continue;
    }

    const coveredComparisonKeys = new Set();

    for (const tag of segment.rationaleTags) {
      if (!tag.id || !tag.value || !tag.reasonJa) {
        addIssue(issues, `segment=${segment.id} tag に必須項目(id/value/reasonJa)が不足しています。`);
      }

      if (!Array.isArray(tag.evidenceRefs) || !tag.evidenceRefs.length) {
        addIssue(issues, `segment=${segment.id} tag=${tag.id ?? "unknown"} に evidenceRefs がありません。`);
        continue;
      }

      for (const reference of tag.evidenceRefs) {
        if (reference.source === "comparison") {
          if (!reference.key) {
            addIssue(issues, `segment=${segment.id} tag=${tag.id} comparison参照に key がありません。`);
            continue;
          }
          if (!VALID_COMPARISON_KEYS.has(reference.key)) {
            addIssue(issues, `segment=${segment.id} tag=${tag.id} comparison key=${reference.key} は不正です。`);
            continue;
          }
          coveredComparisonKeys.add(reference.key);
          continue;
        }

        if (reference.source === "specification") {
          if (!reference.label) {
            addIssue(issues, `segment=${segment.id} tag=${tag.id} specification参照に label がありません。`);
            continue;
          }

          const existsInSegment = segmentProducts.some((product) =>
            product.specifications?.some((specification) => specification.label === reference.label)
          );

          if (!existsInSegment) {
            addIssue(issues, `segment=${segment.id} tag=${tag.id} specification label='${reference.label}' が見つかりません。`);
          }
        }
      }
    }

    const requiredKeys = REQUIRED_SEGMENT_KEYS[segment.id] ?? [];
    for (const requiredKey of requiredKeys) {
      if (!coveredComparisonKeys.has(requiredKey)) {
        addIssue(issues, `segment=${segment.id} に必須comparison key=${requiredKey} の根拠紐付けがありません。`);
      }
    }

    for (const product of segmentProducts) {
      let resolvedCount = 0;
      for (const tag of segment.rationaleTags) {
        resolvedCount += resolveReferenceCount(product, tag.evidenceRefs ?? []);
      }

      if (resolvedCount === 0) {
        addIssue(issues, `product=${product.id} は根拠参照が1件も解決できません。`);
      }
    }
  }

  if (issues.length) {
    console.error(`[validate:rationale-data] NG: ${issues.length}件`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[validate:rationale-data] OK: ${segments.length}市場, ${products.length}製品`);
}

main().catch((error) => {
  console.error(`[validate:rationale-data] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
