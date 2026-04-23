import * as XLSX from 'xlsx';
import * as fs from 'fs';

const buf = fs.readFileSync('public/jangka_retensi_arsip.xlsx');
const wb = XLSX.read(buf, {type:'buffer'});
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

console.log('JRA Rows 0-10:');
for (let i = 0; i < 10; i++) {
    if (data[i]) {
        console.log(`Row ${i}:`, data[i]);
    }
}
