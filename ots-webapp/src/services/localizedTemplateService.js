/**
 * Localized Template Service
 *
 * Generates invoices, packing slips, and labels in target locale languages.
 */

import { formatCurrency, formatDate, getLocale } from './localizationService'

const TEMPLATES = {
  invoice: {
    'en-IN': {
      title: 'TAX INVOICE',
      fields: {
        itemNo: 'Item No.',
        description: 'Description',
        qty: 'Qty',
        rate: 'Rate',
        amount: 'Amount',
      },
      footer: 'Thank you for your business!',
    },
    'en-US': {
      title: 'COMMERCIAL INVOICE',
      fields: {
        itemNo: 'Item #',
        description: 'Description',
        qty: 'Quantity',
        rate: 'Unit Price',
        amount: 'Total',
      },
      footer: 'Thank you for your order!',
    },
    'ar-AE': {
      title: 'فاتورة تجارية',
      fields: {
        itemNo: 'رقم الصنف',
        description: 'الوصف',
        qty: 'الكمية',
        rate: 'السعر',
        amount: 'المبلغ',
      },
      footer: 'شكرا لتعاملكم معنا!',
    },
  },
  packingSlip: {
    'en-IN': {
      title: 'PACKING SLIP',
      shipTo: 'Ship To',
      contents: 'Package Contents',
    },
    'en-US': {
      title: 'PACKING LIST',
      shipTo: 'Deliver To',
      contents: 'Items Included',
    },
  },
  label: {
    'en-IN': {
      from: 'FROM',
      to: 'TO',
      weight: 'Weight',
    },
    'en-US': {
      from: 'ORIGIN',
      to: 'DESTINATION',
      weight: 'Wt.',
    },
  },
}

/**
 * Get localized template data
 * @param {string} templateType - 'invoice', 'packingSlip', 'label'
 * @param {string} locale - Target locale
 * @returns {object}
 */
export const getTemplate = (templateType, locale = null) => {
  const targetLocale = locale || getLocale()
  return TEMPLATES[templateType]?.[targetLocale] || TEMPLATES[templateType]?.['en-IN'] || {}
}

/**
 * Generate localized invoice HTML
 * @param {object} order
 * @param {object[]} items
 * @param {string} locale
 * @returns {string}
 */
export const generateLocalizedInvoice = (order, items = [], locale = null) => {
  const t = getTemplate('invoice', locale)
  const targetLocale = locale || getLocale()

  const itemsHtml = items
    .map(
      (item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.description || item.sku}</td>
            <td>${item.qty || 1}</td>
            <td>${formatCurrency(item.rate || item.price, targetLocale)}</td>
            <td>${formatCurrency((item.rate || item.price) * (item.qty || 1), targetLocale)}</td>
        </tr>
    `
    )
    .join('')

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
                h1 { color: #6366F1; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background: #f5f5f5; }
                .footer { margin-top: 40px; text-align: center; color: #888; }
            </style>
        </head>
        <body>
            <h1>${t.title}</h1>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${formatDate(new Date(), targetLocale)}</p>
            <p><strong>Customer:</strong> ${order.customerName || order.customer || 'N/A'}</p>
            
            <table>
                <thead>
                    <tr>
                        <th>${t.fields.itemNo}</th>
                        <th>${t.fields.description}</th>
                        <th>${t.fields.qty}</th>
                        <th>${t.fields.rate}</th>
                        <th>${t.fields.amount}</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml || '<tr><td colspan="5">No items</td></tr>'}
                </tbody>
            </table>
            
            <p class="footer">${t.footer}</p>
        </body>
        </html>
    `
}

/**
 * Get supported locales for a template type
 * @param {string} templateType
 * @returns {string[]}
 */
export const getSupportedLocales = (templateType) => {
  return Object.keys(TEMPLATES[templateType] || {})
}

export default {
  getTemplate,
  generateLocalizedInvoice,
  getSupportedLocales,
  TEMPLATES,
}
