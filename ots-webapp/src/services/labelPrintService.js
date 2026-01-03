/**
 * Label Print Service
 * Generates ZPL II commands for thermal printers (Zebra, TSC, Honeywell)
 * Supports 4x6 inch shipping labels
 */

class LabelPrintService {
    constructor() {
        this.dpi = 203; // Standard thermal printer DPI
        this.labelWidth = 4; // inches
        this.labelHeight = 6; // inches
    }

    /**
     * Generates ZPL code for a shipping label
     * @param {object} order - Order details
     * @param {object} carrier - Carrier details (optional)
     * @returns {string} ZPL string
     */
    generateZPL(order, carrier = {}) {
        const date = new Date().toISOString().split('T')[0];
        const sender = "Bluewud Furniture";
        const senderAddr = "A-123, Industrial Area, Noida, UP - 201301";

        // ZPL Start
        let zpl = `^XA`;
        zpl += `^PW812`; // Print width 812 dots (4 inches * 203 dpi)
        zpl += `^LL1218`; // Label length 1218 dots (6 inches * 203 dpi)
        zpl += `^PON`; // Print orientation normal

        // Header (Sender)
        zpl += `^FO50,50^A0N,30,30^FD${sender}^FS`;
        zpl += `^FO50,90^A0N,25,25^FD${senderAddr}^FS`;

        // Recipient Box
        zpl += `^FO50,150^GB712,250,3^FS`; // Box
        zpl += `^FO70,170^A0N,25,25^FDShip To:^FS`;
        zpl += `^FO70,210^A0N,40,40^FD${this._sanitize(order.customerName)}^FS`;
        zpl += `^FO70,260^A0N,30,30^FD${this._sanitize(order.shippingAddress?.street || '')}^FS`;
        zpl += `^FO70,300^A0N,30,30^FD${this._sanitize(order.shippingAddress?.city || '')}, ${this._sanitize(order.shippingAddress?.state || '')}^FS`;
        zpl += `^FO70,340^A0N,30,30^FD${order.shippingAddress?.pincode || ''}^FS`;
        zpl += `^FO70,380^A0N,30,30^FDPh: ${order.phoneNumber || ''}^FS`;

        // Routing Info / Carrier
        zpl += `^FO450,170^A0N,50,50^FD${carrier.name || 'Standard'}^FS`;
        zpl += `^FO450,230^A0N,30,30^FDRouting: ${order.shippingAddress?.state?.substring(0, 3).toUpperCase() || 'STD'}^FS`;

        // Barcode (Code 128) - Order ID
        zpl += `^FO50,450^BY3,3,100^BCN,100,Y,N,N^FD${order.id}^FS`;

        // SKU Details
        zpl += `^FO50,600^GB712,400,3^FS`; // Items Box
        let yPos = 620;
        zpl += `^FO70,${yPos}^A0N,25,25^FDContents:^FS`;
        yPos += 40;

        if (order.items && order.items.length > 0) {
            order.items.slice(0, 5).forEach(item => {
                const text = `${item.quantity}x ${item.name.substring(0, 40)}`;
                zpl += `^FO70,${yPos}^A0N,25,25^FD${this._sanitize(text)}^FS`;
                yPos += 30;
            });
        } else {
            zpl += `^FO70,${yPos}^A0N,25,25^FD1x ${this._sanitize(order.productName || 'Furniture Item')}^FS`;
        }

        // Footer
        zpl += `^FO50,1100^A0N,25,25^FDOrder Date: ${order.date || date}^FS`;
        zpl += `^FO450,1100^A0N,40,40^FD${order.paymentMethod === 'COD' ? 'COD: Rs.' + order.amount : 'PREPAID'}^FS`;

        // End Label
        zpl += `^XZ`;

        return zpl;
    }

    /**
     * Sanitizes text for ZPL (removes special chars that might break command)
     */
    _sanitize(text) {
        if (!text) return '';
        // Basic sanitization, ZPL doesn't support full Unicode easily without font packs
        return text.replace(/[^\w\s\-,.]/g, '');
    }

    /**
     * Tries to print using a browser-local web server or WebUSB (Conceptual)
     */
    async printLabel(order) {
        const zpl = this.generateZPL(order);

        // In a real scenario, we would send this to a local QZ Tray websocket
        // or a WebUSB endpoint. For this demo, we'll log it or open a Blob.
        console.log("Generated ZPL:", zpl);

        // Simulation of sending to printer
        try {
            // Check for QZ Tray or similar
            if (window.qz) {
                // await window.qz.print(...)
            } else {
                // Fallback: Open Labelary API to visualize
                const url = `http://labelary.com/viewer.html?density=8&quality=Bitonal&width=4&height=6&units=inches&zpl=${encodeURIComponent(zpl)}`;
                window.open(url, '_blank');
            }
            return { success: true, zpl };
        } catch (e) {
            console.error("Print failed", e);
            return { success: false, error: e.message };
        }
    }
}

// Singleton
export const labelPrintService = new LabelPrintService();
export default labelPrintService;
