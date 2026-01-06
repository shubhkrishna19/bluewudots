import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const legacyDir = path.resolve(__dirname, '../../legacy');

function inspectAll() {
    const files = [
        'SKU Aliases, Parent & Child Master Data (1).xlsx',
        'Order Tracking Sheet OTS - Master 24-25.xlsx',
        'Dimensions Master.xlsx',
        'Sales Trends FY2024-25 (1).xlsx'
    ];

    const report = {};

    files.forEach(file => {
        try {
            const filePath = path.join(legacyDir, file);
            if (!fs.existsSync(filePath)) {
                report[file] = "File not found";
                return;
            }
            const workbook = XLSX.readFile(filePath);
            report[file] = {
                sheets: workbook.SheetNames,
                headers: {}
            };

            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                if (data.length > 0) {
                    report[file].headers[sheetName] = data[0].filter(h => h !== null && h !== undefined);
                }
            });
        } catch (e) {
            report[file] = `Error: ${e.message}`;
        }
    });

    fs.writeFileSync('excel_structure.json', JSON.stringify(report, null, 2));
    console.log('Inspection report saved to excel_structure.json');
}

inspectAll();
