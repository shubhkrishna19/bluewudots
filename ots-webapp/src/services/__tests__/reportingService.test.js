import { describe, it, expect, vi, beforeEach } from 'vitest';
import reportingService from '../reportingService';

// Mock dependencies
vi.mock('jspdf', () => {
    return {
        jsPDF: vi.fn().mockImplementation(() => {
            return {
                text: vi.fn(),
                line: vi.fn(),
                addPage: vi.fn(),
                save: vi.fn(),
                setFontSize: vi.fn(),
                setTextColor: vi.fn(),
            };
        })
    };
});

vi.mock('xlsx', () => ({
    utils: {
        json_to_sheet: vi.fn(),
        book_new: vi.fn(),
        book_append_sheet: vi.fn(),
    },
    writeFile: vi.fn()
}));

vi.mock('papaparse', () => ({
    default: {
        unparse: vi.fn().mockReturnValue('csv,data')
    }
}));

describe('Reporting Service', () => {
    const mockData = [
        { id: '1', name: 'Test 1', amount: 100 },
        { id: '2', name: 'Test 2', amount: 200 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock URL.createObjectURL and document.createElement for CSV export
        global.URL.createObjectURL = vi.fn();
        document.body.appendChild = vi.fn();
        document.body.removeChild = vi.fn();
    });

    it('should generate order summary correctly', () => {
        const orders = [
            { id: 'BWD-1', createdAt: '2026-01-01T10:00:00Z', customerName: 'John', amount: 500, status: 'Pending', sku: 'SKU1' }
        ];
        const summary = reportingService.generateOrderSummary(orders);
        expect(summary[0].ID).toBe('BWD-1');
        expect(summary[0].Date).toBe('2026-01-01');
        expect(summary[0].Customer).toBe('John');
    });

    it('should handle CSV export', () => {
        reportingService.exportToCSV(mockData, 'test.csv');
        // Basic check that it doesn't throw and calls the flow
        expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('should handle Excel export', async () => {
        const XLSX = await import('xlsx');
        reportingService.exportToExcel(mockData, 'test.xlsx');
        expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockData);
        expect(XLSX.writeFile).toHaveBeenCalled();
    });

    it('should handle PDF export', async () => {
        const { jsPDF } = await import('jspdf');
        reportingService.exportToPDF(mockData, 'test.pdf');
        expect(jsPDF).toHaveBeenCalled();
    });
});
