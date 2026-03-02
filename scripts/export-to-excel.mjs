import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const DATA_DIR = path.join(process.cwd(), 'src/data/schneider');
const OUTPUT_FILE = path.join(process.cwd(), 'mcb_specification_master.xlsx');

const productFiles = ['resi9.json', 'easy9.json', 'easy9-pro.json', 'domae.json'];

function flattenProductData() {
    const allRows = [];

    for (const file of productFiles) {
        const filePath = path.join(DATA_DIR, file);
        if (!fs.existsSync(filePath)) continue;

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // If the product has variants, create a row for each variant
        if (data.variants && data.variants.length > 0) {
            for (const variant of data.variants) {
                allRows.push({
                    'Manufacturer': data.manufacturerId,
                    'Series': data.series,
                    'Variant ID': variant.id,
                    'Variant Name': variant.name,
                    'Segment': data.segmentId,
                    // Comparison Fields
                    'Rated Current (In)': variant.comparison?.ratedCurrentIn || data.comparison?.ratedCurrentIn,
                    'Breaking Capacity (Icn)': variant.comparison?.breakingCapacity || data.comparison?.breakingCapacity,
                    'Ics (Service Breaking Capacity)': variant.comparison?.serviceBreakingCapacityIcs || data.comparison?.serviceBreakingCapacityIcs,
                    'Poles': variant.comparison?.numberOfPoles || data.comparison?.numberOfPoles,
                    'Trip Curve': variant.comparison?.tripCurveCharacteristics || data.comparison?.tripCurveCharacteristics,
                    'Rated Voltage (Ue)': variant.comparison?.ratedVoltageUe || data.comparison?.ratedVoltageUe,
                    'Standards': variant.comparison?.standardsApprovals || data.comparison?.standardsApprovals,
                    'Width per Pole': variant.comparison?.widthPerPole || data.comparison?.widthPerPole,
                    // Rationale
                    'Best Value Tag': variant.isBestValue ? 'Yes' : 'No'
                });
            }
        } else {
            // Single product entry
            allRows.push({
                'Manufacturer': data.manufacturerId,
                'Series': data.series,
                'Variant ID': data.id,
                'Variant Name': '-',
                'Segment': data.segmentId,
                // Comparison Fields
                'Rated Current (In)': data.comparison?.ratedCurrentIn,
                'Breaking Capacity (Icn)': data.comparison?.breakingCapacity,
                'Ics (Service Breaking Capacity)': data.comparison?.serviceBreakingCapacityIcs,
                'Poles': data.comparison?.numberOfPoles,
                'Trip Curve': data.comparison?.tripCurveCharacteristics,
                'Rated Voltage (Ue)': data.comparison?.ratedVoltageUe,
                'Standards': data.comparison?.standardsApprovals,
                'Width per Pole': data.comparison?.widthPerPole,
                'Best Value Tag': 'No'
            });
        }
    }

    return allRows;
}

try {
    const data = flattenProductData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MCB Specifications');

    // Column widths
    const wscols = [
        { wch: 20 }, // Manufacturer
        { wch: 15 }, // Series
        { wch: 25 }, // Variant ID
        { wch: 30 }, // Variant Name
        { wch: 15 }, // Segment
        { wch: 20 }, // Rated Current
        { wch: 25 }, // Breaking Capacity
        { wch: 30 }, // Ics
        { wch: 15 }, // Poles
        { wch: 15 }, // Trip Curve
        { wch: 20 }, // Rated Voltage
        { wch: 20 }, // Standards
        { wch: 15 }, // Width per Pole
        { wch: 15 }  // Best Value
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, OUTPUT_FILE);
    console.log(`Successfully exported data to ${OUTPUT_FILE}`);
} catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
}
