import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Universal Export Service
 * Supports CSV, PDF, and XLSX formats.
 */
const reportingService = {
    /**
     * Export data to CSV
     */
    exportToCSV: (data, filename = 'export.csv') => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Export data to Excel (XLSX)
     */
    exportToExcel: (data, filename = 'export.xlsx', sheetName = 'Data') => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, filename);
    },

    /**
     * Export data to PDF
     */
    exportToPDF: (data, filename = 'export.pdf', title = 'Report') => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        // Simple table implementation (for more complex tables, autoTable plugin is recommended)
        let y = 35;
        const headers = Object.keys(data[0] || {});

        // Print Headers
        headers.forEach((header, i) => {
            doc.text(header.toUpperCase(), 14 + (i * 40), y);
        });

        y += 10;
        doc.line(14, y - 5, 200, y - 5);

        // Print Rows (Limit to keep it simple without autoTable)
        data.slice(0, 20).forEach((row) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            headers.forEach((header, i) => {
                const val = String(row[header] || '');
                doc.text(val.substring(0, 15), 14 + (i * 40), y);
            });
            y += 8;
        });

        doc.save(filename);
    },

    /**
     * Generate a summary report from orders
     */
    generateOrderSummary: (orders) => {
        const summary = orders.map(o => ({
            ID: o.id,
            Date: o.createdAt?.split('T')[0],
            Customer: o.customerName,
            Amount: o.amount,
            Status: o.status,
            SKU: o.sku
        }));
        return summary;
    }
};

export default reportingService;
