import fs from 'fs';
import * as XLSX from 'xlsx';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'mcb_specification_master.xlsx');

try {
    const buf = fs.readFileSync(FILE_PATH);
    const workbook = XLSX.read(buf);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(JSON.stringify(data, null, 2));
} catch (error) {
    console.error('Error reading Excel:', error);
    process.exit(1);
}
