/**
 * Thermal Print Service - Zebra Browser Print Integration
 * Enables direct printing to Zebra thermal printers using ZPL (Zebra Programming Language)
 * Falls back gracefully if Zebra Browser Print is not installed
 */

class ThermalPrintService {
    constructor() {
        this.zebraAvailable = false;
        this.selectedPrinter = null;
        this.checkZebraAvailability();
    }

    /**
     * Check if Zebra Browser Print is installed and available
     */
    async checkZebraAvailability() {
        try {
            // Zebra Browser Print exposes BrowserPrint object globally
            if (typeof BrowserPrint !== 'undefined') {
                const printers = await this.getAvailablePrinters();
                this.zebraAvailable = printers.length > 0;
                if (this.zebraAvailable) {
                    this.selectedPrinter = printers[0]; // Auto-select first printer
                    console.log('✅ Zebra Thermal Printer Detected:', this.selectedPrinter.name);
                }
            }
        } catch (err) {
            console.warn('⚠️ Zebra Browser Print not available:', err);
            this.zebraAvailable = false;
        }
    }

    /**
     * Get list of available Zebra printers
     */
    async getAvailablePrinters() {
        return new Promise((resolve, reject) => {
            if (typeof BrowserPrint === 'undefined') {
                reject(new Error('BrowserPrint not loaded'));
                return;
            }

            BrowserPrint.getDefaultDevice('printer', (device) => {
                if (device) {
                    resolve([device]);
                } else {
                    BrowserPrint.getLocalDevices((devices) => {
                        resolve(devices || []);
                    }, reject);
                }
            }, reject);
        });
    }

    /**
     * Generate ZPL (Zebra Programming Language) for shipping label
     * @param {object} order 
     * @returns {string} ZPL code
     */
    generateZPL(order) {
        const zpl = `
^XA
^FO50,50^A0N,40,40^FD${order.carrier || 'CARRIER'}^FS
^FO50,100^A0N,30,30^FD${order.isCOD ? 'COD' : 'PREPAID'}^FS

^FO50,150^BY2^BCN,100,Y,N,N^FD${order.awb || order.id}^FS

^FO50,280^A0N,25,25^FDSHIP TO:^FS
^FO50,310^A0N,30,30^FD${order.customerName || 'Customer'}^FS
^FO50,345^A0N,25,25^FD${order.address || ''}^FS
^FO50,375^A0N,25,25^FD${order.city || ''}, ${order.state || ''} - ${order.pincode || ''}^FS
^FO50,405^A0N,25,25^FDPhone: ${order.phone || ''}^FS

^FO50,450^GB700,1,3^FS

^FO50,470^A0N,20,20^FDFROM: Bluewud India^FS
^FO50,495^A0N,20,20^FDWarehouse, Bangalore 560058^FS

^FO50,540^GB700,1,3^FS

^FO50,560^A0N,18,18^FDOrder: ${order.id}^FS
^FO250,560^A0N,18,18^FDWeight: ${order.weight || 0} kg^FS
^FO450,560^A0N,18,18^FDSKU: ${order.sku || '-'}^FS
${order.isCOD ? `^FO50,590^A0N,18,18^FDCOD Amount: Rs.${order.codAmount || order.amount || 0}^FS` : ''}

^FO50,630^A0N,15,15^FDPowered by Bluewud OTS^FS
^XZ
`;
        return zpl;
    }

    /**
     * Print label to thermal printer
     * @param {object} order 
     * @returns {Promise<object>}
     */
    async printToThermal(order) {
        if (!this.zebraAvailable || !this.selectedPrinter) {
            return {
                success: false,
                error: 'Zebra printer not available',
                fallback: true
            };
        }

        try {
            const zpl = this.generateZPL(order);

            return new Promise((resolve, reject) => {
                this.selectedPrinter.send(zpl,
                    () => {
                        console.log('✅ Label sent to thermal printer');
                        resolve({ success: true, mode: 'thermal' });
                    },
                    (error) => {
                        console.error('❌ Thermal print failed:', error);
                        reject({ success: false, error: error.message, fallback: true });
                    }
                );
            });
        } catch (err) {
            console.error('Thermal print error:', err);
            return { success: false, error: err.message, fallback: true };
        }
    }

    /**
     * Check printer status
     */
    async getPrinterStatus() {
        if (!this.selectedPrinter) {
            return { available: false, name: null };
        }

        return {
            available: this.zebraAvailable,
            name: this.selectedPrinter.name,
            connection: this.selectedPrinter.connection
        };
    }
}

// Singleton Instance
const thermalPrintService = new ThermalPrintService();
export default thermalPrintService;
