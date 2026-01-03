/**
 * LabelGeneratorEnhanced.js
 * Enhanced shipping label generation for multiple carriers
 * Supports Delhivery, BlueDart, XpressBees, and other logistics partners
 */

class LabelGeneratorEnhanced {
  constructor() {
    this.carriers = {
      delhivery: { baseUrl: 'https://track.delhivery.com', apiKey: '' },
      bluedart: { baseUrl: 'https://www.bluedartexpress.com', apiKey: '' },
      xpressbees: { baseUrl: 'https://www.xpressbees.com', apiKey: '' },
      gati: { baseUrl: 'https://www.gatikyc.com', apiKey: '' },
    }
    this.cache = new Map()
  }

  /**
   * Generate shipping label for an order
   */
  async generateLabel(order, carrierName) {
    try {
      const carrier = this.carriers[carrierName.toLowerCase()]
      if (!carrier) {
        throw new Error(`Unsupported carrier: ${carrierName}`)
      }

      // Validate order
      this.validateOrderForLabel(order)

      // Generate carrier-specific label
      const labelData = this._generateCarrierLabel(order, carrierName)
      return labelData
    } catch (error) {
      console.error('Label generation failed:', error)
      throw error
    }
  }

  /**
   * Validate order has required fields for label generation
   */
  validateOrderForLabel(order) {
    const required = ['orderId', 'customerName', 'phone', 'shippingAddress', 'items']
    required.forEach((field) => {
      if (!order[field]) {
        throw new Error(`Missing required field for label: ${field}`)
      }
    })

    if (!order.shippingAddress.address || !order.shippingAddress.pincode) {
      throw new Error('Incomplete shipping address')
    }
  }

  /**
   * Generate Delhivery label format
   */
  _generateDelhiveryLabel(order) {
    const items = order.items || []
    const weight = this._calculateWeight(items)
    const dimensions = this._calculateDimensions(items)

    return {
      shipmentId: `DHV-${order.orderId}-${Date.now()}`,
      carrier: 'delhivery',
      format: 'A4',
      data: {
        shipper: {
          name: 'Bluewud',
          address: 'Bluewud Warehouse',
          pincode: '110001',
          phone: '+91-11-XXXX-XXXX',
          email: 'shipping@bluewud.com',
        },
        consignee: {
          name: order.customerName,
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
          phone: order.phone,
          email: order.email,
        },
        shipment: {
          orderId: order.orderId,
          weight,
          dimensions,
          pieces: items.length,
          serviceType: 'surface',
          amount: order.amount,
          contents: items.map((item) => `${item.quantity}x ${item.name}`).join('; '),
        },
      },
    }
  }

  /**
   * Generate BlueDart label format
   */
  _generateBluedartLabel(order) {
    const items = order.items || []
    const weight = this._calculateWeight(items)

    return {
      shipmentId: `BD-${order.orderId}-${Date.now()}`,
      carrier: 'bluedart',
      format: 'A4',
      data: {
        shipper: {
          name: 'Bluewud',
          address: 'Bluewud Warehouse',
          pincode: '110001',
        },
        receiver: {
          name: order.customerName,
          address: order.shippingAddress.address,
          pincode: order.shippingAddress.pincode,
          phone: order.phone,
        },
        shipmentDetails: {
          refNo: order.orderId,
          weight,
          serviceType: 'parcel',
          cod: order.amount,
          product: items.map((i) => i.name).join(', '),
        },
      },
    }
  }

  /**
   * Generate XpressBees label format
   */
  _generateXpressbeesLabel(order) {
    const items = order.items || []
    const weight = this._calculateWeight(items)

    return {
      shipmentId: `XB-${order.orderId}-${Date.now()}`,
      carrier: 'xpressbees',
      format: 'A4',
      data: {
        pickup: {
          name: 'Bluewud Warehouse',
          address: 'Warehouse Address',
          pincode: '110001',
          state_code: 'DL',
        },
        delivery: {
          name: order.customerName,
          address: order.shippingAddress.address,
          pincode: order.shippingAddress.pincode,
          state_code: this._getStateCode(order.shippingAddress.state),
          phone: order.phone,
        },
        shipment: {
          awb: `XB${order.orderId}`,
          order_id: order.orderId,
          weight,
          length: 30,
          breadth: 20,
          height: 10,
          cod: order.amount,
          description: items.map((i) => i.name).join(', '),
        },
      },
    }
  }

  /**
   * Route to appropriate carrier label generator
   */
  _generateCarrierLabel(order, carrierName) {
    switch (carrierName.toLowerCase()) {
      case 'delhivery':
        return this._generateDelhiveryLabel(order)
      case 'bluedart':
        return this._generateBluedartLabel(order)
      case 'xpressbees':
        return this._generateXpressbeesLabel(order)
      default:
        throw new Error(`Unsupported carrier: ${carrierName}`)
    }
  }

  /**
   * Calculate total weight from items
   */
  _calculateWeight(items) {
    return items.reduce((total, item) => total + (item.weight || 0.5), 0)
  }

  /**
   * Calculate dimensions from items
   */
  _calculateDimensions(items) {
    return {
      length: 30,
      width: 20,
      height: 10,
      unit: 'cm',
    }
  }

  /**
   * Get state code from state name
   */
  _getStateCode(stateName) {
    const stateMap = {
      Delhi: 'DL',
      Maharashtra: 'MH',
      Karnataka: 'KA',
      'Tamil Nadu': 'TN',
      'Uttar Pradesh': 'UP',
      'West Bengal': 'WB',
      Rajasthan: 'RJ',
      Gujarat: 'GJ',
    }
    return stateMap[stateName] || 'XX'
  }

  /**
   * Generate batch labels for multiple orders
   */
  async generateBatchLabels(orders, carrierName) {
    const labels = []
    for (const order of orders) {
      try {
        const label = await this.generateLabel(order, carrierName)
        labels.push(label)
      } catch (error) {
        labels.push({
          orderId: order.orderId,
          error: error.message,
        })
      }
    }
    return labels
  }

  /**
   * Export label as PDF
   */
  async exportLabelAsPDF(labelData) {
    // This would integrate with a PDF generation library
    return {
      success: true,
      fileName: `${labelData.shipmentId}.pdf`,
      base64: 'PDF data would be here',
    }
  }

  /**
   * Generate ZPL String for Thermal Printers
   */
  generateZPL(labelData) {
    const { shipper, consignee, shipment, shipmentDetails, delivery } = labelData.data
    const dest = consignee || receiver || delivery
    const ship = shipment || shipmentDetails

    // Industrial Standard 4x6 Thermal Label ZPL Template
    return `
^XA
^FX Top Section: Logo & Carrier
^CF0,60
^FO50,50^GB700,1,3^FS
^FO50,70^FD${labelData.carrier.toUpperCase()}^FS
^CF0,30
^FO450,70^FDDate: ${new Date().toLocaleDateString()}^FS

^FX Recipient Info
^FO50,150^FDTo: ${dest.name}^FS
^FO50,190^FD${dest.address.substring(0, 40)}^FS
^FO50,230^FD${dest.city}, ${dest.state} - ${dest.pincode}^FS
^FO50,270^FDPH: ${dest.phone}^FS

^FX Barcode
^BY3,2,100
^FO100,350^BCN,100,Y,N,N^FD${labelData.shipmentId}^FS

^FX Bottom Section
^FO50,520^GB700,1,3^FS
^FO50,540^FDOrder ID: ${labelData.data.shipment?.orderId || labelData.shipmentId}^FS
^FO50,580^FDItems: ${labelData.data.shipment?.contents || 'Package Content'}^FS
^FO450,540^FDWeight: ${labelData.data.shipment?.weight || '0.5'} KG^FS
^XZ
    `.trim()
  }

  /**
   * Track shipment
   */
  async trackShipment(shipmentId, carrierName) {
    const carrier = this.carriers[carrierName.toLowerCase()]
    if (!carrier) {
      throw new Error(`Unsupported carrier: ${carrierName}`)
    }

    // This would call the actual carrier API
    return {
      shipmentId,
      carrier: carrierName,
      status: 'in_transit',
      lastUpdate: new Date().toISOString(),
      events: [],
    }
  }

  /**
   * Validate carrier API credentials
   */
  setCarrierCredentials(carrierName, apiKey) {
    const carrier = this.carriers[carrierName.toLowerCase()]
    if (!carrier) {
      throw new Error(`Unsupported carrier: ${carrierName}`)
    }
    carrier.apiKey = apiKey
  }
}

// Export singleton instance
const labelGenerator = new LabelGeneratorEnhanced()
export default labelGenerator
