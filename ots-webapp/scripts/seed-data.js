import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const legacyDir = path.resolve(__dirname, '../../legacy');
const outputDir = path.resolve(__dirname, '../src/data/seed');
const publicDir = path.resolve(__dirname, '../public/data');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

function parseExcelDate(val) {
    if (!val) return new Date().toISOString();
    try {
        // Handle Excel Serial Numbers (Numbers)
        if (typeof val === 'number') {
            // Excel's epoch is Dec 30, 1899
            const date = new Date(Math.round((val - 25569) * 86400 * 1000));
            return date.toISOString();
        }

        // Handle String dates like "29-12-2024" or "2024/12/29"
        if (typeof val === 'string') {
            // Check for DD-MM-YYYY
            const ddmmyyyy = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(val);
            if (ddmmyyyy) {
                const [_, d, m, y] = ddmmyyyy;
                return new Date(y, m - 1, d).toISOString();
            }

            const d = new Date(val);
            if (!isNaN(d.getTime())) return d.toISOString();
        }

        return new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

function extractDimensions() {
    console.log('📏 Extracting Dimensions...');
    const file = 'Dimensions Master.xlsx';
    const workbook = XLSX.readFile(path.join(legacyDir, file));
    const sheet = workbook.Sheets['Billing Dimensions'];
    const rawData = XLSX.utils.sheet_to_json(sheet, { range: 2 });

    const dimensions = {};
    rawData.forEach(row => {
        const sku = String(row['MTP SKU Code'] || '').trim();
        if (!sku) return;

        dimensions[sku] = {
            l: parseFloat(row['Lcm']) || 0,
            b: parseFloat(row['Bcm']) || 0,
            h: parseFloat(row['Hcm']) || 0,
            weight: (parseFloat(row['PW(gm)']) || 0) / 1000,
            boxes: row['SB/MB'] === 'MB' ? 2 : 1
        };
    });

    fs.writeFileSync(path.join(outputDir, 'dimensions.json'), JSON.stringify(dimensions, null, 2));
    fs.writeFileSync(path.join(publicDir, 'dimensions.json'), JSON.stringify(dimensions, null, 2));
}

function extractSKUMaster() {
    console.log('📦 Extracting SKU Master...');
    const file = 'SKU Aliases, Parent & Child Master Data (1).xlsx';
    const workbook = XLSX.readFile(path.join(legacyDir, file));
    const sheet = workbook.Sheets['Child SKUs - Alias Master'];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const skuMaster = rawData.map(row => {
        const parentSku = String(row['MTP SKU'] || '').trim();
        return {
            sku: String(row['SKU Code'] || 'UNKNOWN').trim(),
            parentSku,
            name: String(row['SKU Product Name'] || row['MTP Name'] || 'Unknown Product'),
            color: String(row[' Child Color'] || ''),
            asin: String(row['ASIN'] || ''),
            fkfsn: String(row['FK FSN'] || ''),
            platform: row['UL'] ? 'Urban Ladder' : (row['PF '] ? 'Pepperfry' : 'Omnichannel'),
            stock: Math.floor(Math.random() * 150),
            price: parseFloat(row['MRP']) || 9999,
            bomCost: Math.round((parseFloat(row['MRP']) || 10000) * 0.45) + Math.floor(Math.random() * 500),
            tmsLevel: ['TL1', 'TL2', 'TL3'][Math.floor(Math.random() * 3)],
            category: 'Furniture'
        };
    });

    fs.writeFileSync(path.join(outputDir, 'skuMaster.json'), JSON.stringify(skuMaster, null, 2));
    fs.writeFileSync(path.join(publicDir, 'skuMaster.json'), JSON.stringify(skuMaster, null, 2));
    console.log(`✅ Extracted ${skuMaster.length} SKUs`);
}

function extractOrders() {
    console.log('🚚 Extracting Orders...');
    const file = 'Order Tracking Sheet OTS - Master 24-25.xlsx';
    const workbook = XLSX.readFile(path.join(legacyDir, file));
    const sheet = workbook.Sheets['AWB Tracking - Master'];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const orders = rawData.filter(row => row['Order ID'] || row['AWB']).map((row, i) => ({
        id: String(row['Order ID'] || `UNK-${i}`),
        source: String(row['Mplace'] || 'Direct'),
        customer: String(row['Customer Name'] || 'Customer'),
        city: String(row['City'] || ''),
        sku: String(row['SKU'] || ''),
        quantity: parseInt(row['Qty']) || 1,
        phone: String(row['Contact'] || ''),
        orderDate: parseExcelDate(row['Ord.Date']),
        awb: String(row['AWB'] || ''),
        carrier: String(row['Shipping Service'] || 'TBD'),
        status: String(row['MIS '] || 'Pending'),
        shipType: String(row['Ship.Type'] || 'Standard'),
        amount: parseFloat(row['Amount']) || 0
    }));

    fs.writeFileSync(path.join(outputDir, 'orders.json'), JSON.stringify(orders, null, 2));
    fs.writeFileSync(path.join(publicDir, 'orders.json'), JSON.stringify(orders, null, 2));
    console.log(`✅ Extracted ${orders.length} Orders`);
}

function extractSales() {
    console.log('💰 Extracting Sales Trends...');
    const file = 'Sales Trends FY2024-25 (1).xlsx';
    const workbook = XLSX.readFile(path.join(legacyDir, file));
    const sheet = workbook.Sheets['Final Sale Data'];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const sales = rawData.map(row => ({
        date: parseExcelDate(row['VchDate']),
        orderId: String(row['Order ID'] || ''),
        party: String(row['Billed Party Name'] || ''),
        item: String(row['Item Desc'] || ''),
        qty: parseInt(row['Qty. ']) || 0,
        taxableValue: parseFloat(row['Taxable Value']) || 0,
        amount: parseFloat(row['Final Invoice Value']) || 0,
        type: String(row['Transaction Type'] || 'Sale')
    }));

    fs.writeFileSync(path.join(outputDir, 'sales.json'), JSON.stringify(sales, null, 2));
    fs.writeFileSync(path.join(publicDir, 'sales.json'), JSON.stringify(sales, null, 2));
    console.log(`✅ Extracted ${sales.length} Sales Records`);
}

function runSeed() {
    try {
        extractDimensions();
        extractSKUMaster();
        extractOrders();
        extractSales();
        console.log('🚀 SYSTEM SEED COMPLETE');
    } catch (e) {
        console.error('❌ FATAL SEED ERROR:', e.message);
        console.error(e.stack);
    }
}

runSeed();
