import * as XLSX from 'xlsx';
import * as fs from 'fs';

const buf = fs.readFileSync('public/Format_Daftar_Arsip.xlsx');
const wb = XLSX.read(buf, {type:'buffer'});
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

console.log('Listing rows 10-20:');
for (let i = 10; i < 20; i++) {
    console.log(`Row ${i}:`, data[i]);
}
