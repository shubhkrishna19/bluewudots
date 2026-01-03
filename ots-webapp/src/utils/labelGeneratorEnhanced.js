/**
 * Enhanced Label Generator Utility
 * Integrates with multiple carrier APIs for label generation
 *
 * Supported Carriers:
 * - Delhivery
 * - BlueDart
 * - XpressBees
 *
 * Features:
 * - Multi-carrier support
 * - PDF generation
 * - Barcode creation
 * - Error handling & retry logic
 */

import { sanitizeInput } from './dataUtils'

const CARRIER_CONFIGS = {
  delhivery: {
    apiUrl: 'https://track.delhivery.com/api/shipments',
    authHeader: 'X-Delhivery-Auth',
    timeout: 30000,
  },
  bluedart: {
    apiUrl: 'https://track.bluedart.com/api',
    authHeader: 'Authorization',
    timeout: 30000,
  },
  xpressbees: {
    apiUrl: 'https://api.xpressbees.com/shipments',
    authHeader: 'Authorization',
    timeout: 30000,
  },
}

/**
 * Generates shipping label for given order
 * @param {object} order - Order object with details
 * @param {string} carrier - Carrier name (delhivery, bluedart, xpressbees)
 * @returns {Promise<object>} Label data and tracking info
 */
export const generateLabel = async (order, carrier = 'delhivery') => {
  try {
    const config = CARRIER_CONFIGS[carrier.toLowerCase()]
    if (!config) {
      throw new Error(`Unsupported carrier: ${carrier}`)
    }

    const labelData = await callCarrierAPI(order, carrier, config)

    return {
      success: true,
      carrier,
      labelData,
      trackingId: labelData.trackingId || labelData.waybill_number,
      labelUrl: labelData.label_url || labelData.pdfUrl,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Label generation failed for ${carrier}:`, error)
    return {
      success: false,
      carrier,
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Calls carrier API with order details
 * @param {object} order - Order object
 * @param {string} carrier - Carrier name
 * @param {object} config - Carrier configuration
 * @returns {Promise<object>} API response
 */
const callCarrierAPI = async (order, carrier, config) => {
  const payload = buildCarrierPayload(order, carrier)

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [config.authHeader]: getCarrierToken(carrier),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Carrier API error: ${error.message || response.statusText}`)
  }

  return response.json()
}

/**
 * Builds API payload based on carrier requirements
 * @param {object} order - Order object
 * @param {string} carrier - Carrier name
 * @returns {object} Formatted payload
 */
const buildCarrierPayload = (order, carrier) => {
  const basePayload = {
    recipientName: order.shipping.name,
    recipientEmail: order.customer.email,
    recipientPhone: order.customer.phone,
    recipientAddress: formatAddress(order.shipping),
    senderName: 'Bluewud Concepts',
    senderPhone: '9999999999',
    shipmentType: order.items[0]?.type || 'POD',
    weight: calculateWeight(order),
    dimensions: calculateDimensions(order),
    codAmount: order.paymentMethod === 'cod' ? order.total : 0,
    reference: order.id,
  }

  // Carrier-specific fields
  switch (carrier.toLowerCase()) {
    case 'delhivery':
      return {
        ...basePayload,
        shipment_type: basePayload.shipmentType,
        payment_mode: order.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
      }
    case 'bluedart':
      return {
        ...basePayload,
        service_type: 'S',
        declared_value: order.total,
      }
    case 'xpressbees':
      return {
        ...basePayload,
        shipment_type: basePayload.shipmentType.toUpperCase(),
        warehouse_name: 'DEFAULT',
      }
    default:
      return basePayload
  }
}

/**
 * Formats address for carrier API
 * @param {object} address - Address object
 * @returns {string} Formatted address
 */
const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.pincode}`
}

/**
 * Calculates total weight from order items
 * @param {object} order - Order object
 * @returns {number} Weight in kg
 */
const calculateWeight = (order) => {
  return (order.items || []).reduce((total, item) => {
    return total + (item.weight || 0.5) * (item.quantity || 1)
  }, 0)
}

/**
 * Calculates dimensions from order items
 * @param {object} order - Order object
 * @returns {object} Dimensions (l, b, h in cm)
 */
const calculateDimensions = (order) => {
  // Default box dimensions
  return {
    length: 30,
    breadth: 20,
    height: 10,
  }
}

/**
 * Gets authentication token for carrier
 * @param {string} carrier - Carrier name
 * @returns {string} Authentication token
 */
const getCarrierToken = (carrier) => {
  const tokens = {
    delhivery: import.meta.env.VITE_DELHIVERY_API_TOKEN,
    bluedart: import.meta.env.VITE_BLUEDART_LICENSE_KEY,
    xpressbees: import.meta.env.VITE_XPRESSBEES_API_KEY,
  }
  return tokens[carrier.toLowerCase()] || ''
}

/**
 * Generates PDF label from label data
 * @param {object} labelData - Label data from carrier
 * @returns {Promise<Blob>} PDF blob
 */
export const generatePDF = async (labelData) => {
  try {
    // Check if label URL is provided by carrier
    if (labelData.pdfUrl || labelData.label_url) {
      const url = labelData.pdfUrl || labelData.label_url
      const response = await fetch(url)
      return await response.blob()
    }

    // Fallback: Generate PDF using jsPDF and html2canvas
    const { jsPDF } = window.jspdf
    const html2canvas = window.html2canvas

    const canvas = await html2canvas(createLabelHTML(labelData))
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)

    return pdf.output('blob')
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  }
}

/**
 * Creates HTML for label printing
 * @param {object} labelData - Label data
 * @returns {HTMLElement} Label HTML element
 */
const createLabelHTML = (labelData) => {
  const div = document.createElement('div')
  div.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="text-align: center;">SHIPPING LABEL</h2>
      <div style="margin: 20px 0;">
        <p><strong>Recipient:</strong> ${sanitizeInput(labelData.recipientName)}</p>
        <p><strong>Address:</strong> ${sanitizeInput(labelData.recipientAddress)}</p>
        <p><strong>Phone:</strong> ${sanitizeInput(labelData.recipientPhone)}</p>
      </div>
      <div style="margin: 20px 0;">
        <p><strong>Tracking ID:</strong> ${labelData.trackingId}</p>
        <p><strong>Weight:</strong> ${labelData.weight} kg</p>
        <p><strong>Dimensions:</strong> ${labelData.dimensions?.length}x${labelData.dimensions?.breadth}x${labelData.dimensions?.height} cm</p>
      </div>
      <svg id="barcode" style="margin: 20px 0;"></svg>
    </div>
  `
  return div
}

/**
 * Downloads label as PDF
 * @param {object} labelData - Label data
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const downloadLabel = async (labelData, filename = 'shipping_label.pdf') => {
  try {
    const pdf = await generatePDF(labelData)
    const url = URL.createObjectURL(pdf)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Label download failed:', error)
    throw error
  }
}

/**
 * Generates barcode image data
 * @param {string} value - Barcode value
 * @returns {string} SVG barcode data
 */
export const generateBarcode = (value) => {
  // Use jsbarcode library or similar
  // This is a placeholder for barcode generation
  return `<svg><text>${value}</text></svg>`
}

/**
 * Retries label generation if it fails
 * @param {object} order - Order object
 * @param {string} carrier - Carrier name
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<object>} Label data or error
 */
export const generateLabelWithRetry = async (order, carrier, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateLabel(order, carrier)
      if (result.success) return result

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
    }
  }
}

// Export all functions
export default {
  generateLabel,
  generatePDF,
  downloadLabel,
  generateBarcode,
  generateLabelWithRetry,
}
