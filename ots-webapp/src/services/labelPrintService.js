/**
 * Label & Print Service - Generate shipping labels, manifests, and invoices
 * Uses browser print APIs with proper formatting for thermal printers
 */

// Label size configurations
export const LABEL_SIZES = {
    '4x6': { width: 4, height: 6, dpi: 203, name: '4x6 Standard' },
    '4x4': { width: 4, height: 4, dpi: 203, name: '4x4 Compact' },
    'A5': { width: 5.83, height: 8.27, dpi: 300, name: 'A5 Sheet' },
    'A4': { width: 8.27, height: 11.69, dpi: 300, name: 'A4 Sheet' }
};

// Barcode font (Code 128 simulation using characters)
const generateBarcode128 = (text) => {
    // Simple representation - in production, use a proper barcode library
    return text.split('').map(c => {
        const code = c.charCodeAt(0);
        return '|'.repeat(Math.max(1, code % 4 + 1)) + ' ';
    }).join('');
};

/**
 * Generate HTML for a shipping label
 * @param {object} order - Order data
 * @param {string} size - Label size key
 * @returns {string} - HTML content
 */
export const generateLabelHTML = (order, size = '4x6') => {
    const labelSize = LABEL_SIZES[size];

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Shipping Label - ${order.awb || order.id}</title>
    <style>
        @page {
            size: ${labelSize.width}in ${labelSize.height}in;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 10pt;
            width: ${labelSize.width}in;
            height: ${labelSize.height}in;
            padding: 8px;
        }
        .label-container {
            border: 2px solid #000;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 2px solid #000;
            background: #f0f0f0;
        }
        .carrier-logo {
            font-size: 18pt;
            font-weight: bold;
        }
        .awb-section {
            text-align: center;
            padding: 8px;
            border-bottom: 1px solid #000;
        }
        .awb-number {
            font-size: 14pt;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .barcode {
            font-family: 'Courier New', monospace;
            font-size: 24pt;
            text-align: center;
            margin: 8px 0;
            letter-spacing: -2px;
        }
        .address-section {
            flex: 1;
            padding: 8px;
        }
        .address-header {
            font-size: 8pt;
            color: #666;
            margin-bottom: 4px;
        }
        .address-name {
            font-size: 12pt;
            font-weight: bold;
        }
        .address-line {
            font-size: 10pt;
        }
        .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-top: 1px solid #000;
            background: #f8f8f8;
        }
        .detail-item {
            text-align: center;
        }
        .detail-label {
            font-size: 7pt;
            color: #666;
        }
        .detail-value {
            font-size: 10pt;
            font-weight: bold;
        }
        .footer {
            padding: 4px 8px;
            border-top: 2px solid #000;
            font-size: 7pt;
            text-align: center;
            background: #000;
            color: #fff;
        }
        .cod-badge {
            background: #ff0000;
            color: #fff;
            padding: 2px 8px;
            font-weight: bold;
            font-size: 10pt;
        }
    </style>
</head>
<body>
    <div class="label-container">
        <div class="header">
            <div class="carrier-logo">${order.carrier || 'CARRIER'}</div>
            <div>
                ${order.isCOD ? '<span class="cod-badge">COD</span>' : '<span style="font-weight:bold">PREPAID</span>'}
            </div>
        </div>
        
        <div class="awb-section">
            <div class="awb-number">${order.awb || 'AWB-PENDING'}</div>
            <div class="barcode">${generateBarcode128(order.awb || order.id)}</div>
        </div>
        
        <div class="address-section">
            <div class="address-header">SHIP TO:</div>
            <div class="address-name">${order.customerName || 'Customer'}</div>
            <div class="address-line">${order.address || ''}</div>
            <div class="address-line">${order.city || ''}, ${order.state || ''} - ${order.pincode || ''}</div>
            <div class="address-line" style="margin-top: 4px;">📞 ${order.phone || ''}</div>
            
            <div style="margin-top: 16px; border-top: 1px dashed #ccc; padding-top: 8px;">
                <div class="address-header">FROM:</div>
                <div class="address-line"><strong>Bluewud India</strong></div>
                <div class="address-line">Warehouse, Bangalore 560058</div>
            </div>
        </div>
        
        <div class="details-row">
            <div class="detail-item">
                <div class="detail-label">ORDER ID</div>
                <div class="detail-value">${order.id}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">WEIGHT</div>
                <div class="detail-value">${order.weight || 0} kg</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">SKU</div>
                <div class="detail-value">${order.sku || '-'}</div>
            </div>
            ${order.isCOD ? `
            <div class="detail-item">
                <div class="detail-label">COD AMT</div>
                <div class="detail-value">₹${order.codAmount || order.amount || 0}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            Powered by Bluewud OTS • ${new Date().toLocaleDateString('en-IN')}
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Print a shipping label
 * @param {object} order 
 * @param {string} size 
 */
export const printLabel = (order, size = '4x6') => {
    const html = generateLabelHTML(order, size);
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Auto-print after content loads
    printWindow.onload = () => {
        printWindow.print();
    };
};

/**
 * Generate manifest/pickup sheet for multiple orders
 * @param {object[]} orders 
 * @param {string} carrier 
 * @returns {string} - HTML content
 */
export const generateManifestHTML = (orders, carrier = 'All Carriers') => {
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const rows = orders.map((order, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td><strong>${order.id}</strong></td>
            <td>${order.awb || '-'}</td>
            <td>${order.customerName}</td>
            <td>${order.city}, ${order.state}</td>
            <td>${order.weight} kg</td>
            <td>${order.isCOD ? '₹' + (order.codAmount || order.amount) : 'PREPAID'}</td>
            <td style="width: 60px;"></td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Manifest - ${date}</title>
    <style>
        @page { size: A4; margin: 10mm; }
        body { font-family: Arial, sans-serif; font-size: 9pt; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .title { font-size: 18pt; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; font-weight: bold; }
        .footer { margin-top: 30px; display: flex; justify-content: space-between; }
        .signature { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="title">PICKUP MANIFEST</div>
            <div>Date: ${date}</div>
        </div>
        <div style="text-align: right;">
            <div><strong>Bluewud India</strong></div>
            <div>Carrier: ${carrier}</div>
            <div>Total: ${orders.length} shipments</div>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>AWB</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Weight</th>
                <th>COD/Prepaid</th>
                <th>Received ✓</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    
    <div class="footer">
        <div>
            <p><strong>Warehouse Staff:</strong></p>
            <div class="signature">Signature & Date</div>
        </div>
        <div>
            <p><strong>Carrier Executive:</strong></p>
            <div class="signature">Signature & Date</div>
        </div>
    </div>
    
    <p style="margin-top: 20px; font-size: 8pt; color: #666; text-align: center;">
        Generated by Bluewud OTS • ${new Date().toLocaleString('en-IN')}
    </p>
</body>
</html>
    `;
};

/**
 * Print manifest
 * @param {object[]} orders 
 * @param {string} carrier 
 */
export const printManifest = (orders, carrier) => {
    const html = generateManifestHTML(orders, carrier);
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
};

/**
 * Generate packing slip
 * @param {object} order 
 * @returns {string}
 */
export const generatePackingSlipHTML = (order) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Packing Slip - ${order.id}</title>
    <style>
        @page { size: A5; margin: 10mm; }
        body { font-family: Arial, sans-serif; font-size: 10pt; }
        .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
        .company { font-size: 16pt; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #f0f0f0; }
        .thank-you { text-align: center; margin-top: 30px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">Bluewud India</div>
        <div>Furniture that defines you</div>
    </div>
    
    <p><strong>Order #:</strong> ${order.id}</p>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Shipping To:</strong> ${order.address || ''}, ${order.city}, ${order.state} - ${order.pincode}</p>
    
    <table>
        <thead>
            <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Qty</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${order.sku}</td>
                <td>${order.productName || 'Product'}</td>
                <td>${order.quantity || 1}</td>
            </tr>
        </tbody>
    </table>
    
    <div class="thank-you">
        <p>Thank you for shopping with Bluewud!</p>
        <p>Questions? Contact us at support@bluewud.in</p>
    </div>
</body>
</html>
    `;
};

/**
 * Download labels as PDF (opens print dialog)
 * @param {object[]} orders 
 * @param {string} size 
 */
export const batchPrintLabels = (orders, size = '4x6') => {
    orders.forEach((order, idx) => {
        setTimeout(() => {
            printLabel(order, size);
        }, idx * 500); // Stagger to avoid popup blocking
    });
};

export default {
    LABEL_SIZES,
    generateLabelHTML,
    printLabel,
    generateManifestHTML,
    printManifest,
    generatePackingSlipHTML,
    batchPrintLabels
};
