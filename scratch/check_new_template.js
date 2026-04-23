import * as XLSX from 'xlsx';
import * as fs from 'fs';

const buf = fs.readFileSync('public/Template_Format_Daftar_Arsip.xlsx');
const wb = XLSX.read(buf, {type:'buffer'});
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

console.log('Listing rows with text:');
for (let i = 0; i < 100; i++) {
    if (data[i] && data[i].some(cell => cell !== null && cell !== undefined)) {
        console.log(`Row ${i}:`, data[i]);
    }
}
