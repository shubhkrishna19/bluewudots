/**
 * returnService.js
 * Aggregates returns from internal system, Shopify, and Marketplaces.
 * Handles auto-approval logic and refund triggers.
 */

// Mock External Data
const SHOPIFY_RETURNS = [
  {
    id: 'SH-RET-001',
    orderId: 'SH-1024',
    customer: 'Alice V.',
    items: [{ sku: 'SKU_A', qty: 1 }],
    reason: 'Size too small',
    channel: 'Shopify',
    status: 'Pending',
    value: 1200,
    date: new Date().toISOString(),
  },
  {
    id: 'SH-RET-002',
    orderId: 'SH-1029',
    customer: 'Bob M.',
    items: [{ sku: 'SKU_B', qty: 1 }],
    reason: 'Damaged',
    channel: 'Shopify',
    status: 'Pending',
    value: 450,
    date: new Date(Date.now() - 86400000).toISOString(),
  },
]

const AMAZON_RETURNS = [
  {
    id: 'AMZ-RET-999',
    orderId: '112-334455-6677',
    customer: 'Charlie',
    items: [{ sku: 'SKU_C', qty: 2 }],
    reason: 'Defective',
    channel: 'Amazon',
    status: 'Pending',
    value: 2400,
    date: new Date().toISOString(),
  },
]

class ReturnService {
  constructor() {
    this.returns = [...SHOPIFY_RETURNS, ...AMAZON_RETURNS]
  }

  /**
   * Fetch all pending returns from all channels
   */
  async fetchPendingReturns() {
    // In prod, this would make parallel API calls
    // await Promise.all([shopify.getReturns(), amazon.getReturns()])
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.returns])
      }, 500)
    })
  }

  /**
   * Process an action on a return (Approve, Reject, Refund)
   */
  async processAction(returnId, action, notes = '') {
    const ret = this.returns.find((r) => r.id === returnId)
    if (!ret) throw new Error('Return not found')

    ret.status = this._getNextStatus(ret.status, action)
    ret.lastUpdated = new Date().toISOString()
    if (notes) ret.notes = notes

    return ret
  }

  _getNextStatus(current, action) {
    switch (action) {
      case 'APPROVE':
        return 'In Transit'
      case 'REJECT':
        return 'Rejected'
      case 'RECEIVE':
        return 'QC Pending'
      case 'QC_PASS':
        return 'Refund Pending'
      case 'QC_FAIL':
        return 'Dispute'
      case 'REFUND':
        return 'Refunded'
      default:
        return current
    }
  }

  /**
   * Run Auto-Approval Rules on a return request
   * @returns {boolean} true if auto-approved
   */
  runAutoApproval(returnRequest) {
    // Rule 1: Low Value Items (< 500) && Reason != 'Missing'
    if (returnRequest.value < 500 && returnRequest.reason !== 'Missing Item') {
      return true
    }

    // Rule 2: Exchange requests (mock logic)
    if (returnRequest.type === 'Exchange') {
      return true
    }

    return false
  }
}

export default new ReturnService()
