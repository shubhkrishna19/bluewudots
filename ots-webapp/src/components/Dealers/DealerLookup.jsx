import { useData } from '../../context/DataContext'
import DealerOrderEntry from './DealerOrderEntry'
import { ArrowLeft, User, MapPin, CreditCard, Clock } from 'lucide-react'

// Mock dealer data (will be replaced with Zoho CRM API fetch)
const MOCK_DEALERS = [
  {
    id: 'DLR-001',
    name: 'Furniture World',
    code: 'FW-BLR',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'Distributor',
    creditLimit: 500000,
    active: true,
  },
  {
    id: 'DLR-002',
    name: 'Home Decor Hub',
    code: 'HDH-MUM',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Retailer',
    creditLimit: 250000,
    active: true,
  },
  {
    id: 'DLR-003',
    name: 'Lifestyle Furnish',
    code: 'LF-DEL',
    city: 'Delhi',
    state: 'Delhi',
    type: 'Franchise',
    creditLimit: 750000,
    active: true,
  },
  {
    id: 'DLR-004',
    name: 'Comfort Zone',
    code: 'CZ-CHN',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Retailer',
    creditLimit: 200000,
    active: false,
  },
  {
    id: 'DLR-005',
    name: 'Urban Living',
    code: 'UL-HYD',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'Distributor',
    creditLimit: 400000,
    active: true,
  },
]

const DealerLookup = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDealer, setSelectedDealer] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  const filteredDealers = MOCK_DEALERS.filter((dealer) => {
    const matchesSearch =
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || dealer.type === filterType
    return matchesSearch && matchesType
  })

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  if (isCreatingOrder && selectedDealer) {
    return (
      <DealerOrderEntry
        dealer={selectedDealer}
        onBack={() => setIsCreatingOrder(false)}
        onComplete={() => {
          setIsCreatingOrder(false)
          // Optionally refresh history or profile
        }}
      />
    )
  }

  return (
    <div className="dealer-module animate-fade">
      <div className="section-header">
        <h2>Dealer Network</h2>
        <p className="text-muted">CRM Account Lookup & Wholesale Orders</p>
      </div>

      <div
        className="dealer-controls glass"
        style={{
          padding: '20px',
          marginTop: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div className="search-input" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-accent)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-accent)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: '#fff',
          }}
        >
          <option value="all">All Types</option>
          <option value="Distributor">Distributors</option>
          <option value="Retailer">Retailers</option>
          <option value="Franchise">Franchises</option>
        </select>
      </div>

      <div
        className="dealer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: selectedDealer ? '1fr 1fr' : '1fr',
          gap: '24px',
          marginTop: '24px',
        }}
      >
        <div className="dealer-list">
          {filteredDealers.map((dealer) => (
            <div
              key={dealer.id}
              className={`dealer-card glass glass-hover ${selectedDealer?.id === dealer.id ? 'selected' : ''}`}
              style={{
                padding: '20px',
                marginBottom: '12px',
                cursor: 'pointer',
                borderLeft: selectedDealer?.id === dealer.id ? '4px solid var(--primary)' : 'none',
                opacity: dealer.active ? 1 : 0.5,
              }}
              onClick={() => setSelectedDealer(dealer)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h4 style={{ marginBottom: '4px' }}>{dealer.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {dealer.code}
                  </p>
                </div>
                <span
                  className="badge"
                  style={{
                    background:
                      dealer.type === 'Distributor'
                        ? 'var(--primary)'
                        : dealer.type === 'Retailer'
                          ? 'var(--accent)'
                          : 'var(--success)',
                    fontSize: '0.65rem',
                  }}
                >
                  {dealer.type}
                </span>
              </div>
              <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                {dealer.city}, {dealer.state}
              </p>
            </div>
          ))}
          {filteredDealers.length === 0 && (
            <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
              <p className="text-muted">No dealers found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {selectedDealer && (
          <div className="dealer-detail glass animate-fade" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
              }}
            >
              <div>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  DEALER PROFILE
                </span>
                <h3>{selectedDealer.name}</h3>
              </div>
              <span
                className={`badge ${selectedDealer.active ? '' : 'inactive'}`}
                style={{ background: selectedDealer.active ? 'var(--success)' : 'var(--danger)' }}
              >
                {selectedDealer.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div
              className="detail-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
            >
              <div className="detail-item">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  DEALER CODE
                </span>
                <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedDealer.code}</p>
              </div>
              <div className="detail-item">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  TYPE
                </span>
                <p style={{ fontWeight: '700' }}>{selectedDealer.type}</p>
              </div>
              <div className="detail-item">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  LOCATION
                </span>
                <p>
                  {selectedDealer.city}, {selectedDealer.state}
                </p>
              </div>
              <div className="detail-item">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  CREDIT LIMIT
                </span>
                <p style={{ fontWeight: '700', color: 'var(--success)' }}>
                  {formatINR(selectedDealer.creditLimit)}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              <button
                className="btn-primary glass-hover"
                style={{ width: '100%', marginBottom: '10px' }}
                onClick={() => setIsCreatingOrder(true)}
              >
                Create Dealer Order
              </button>
              <button className="btn-secondary glass-hover" style={{ width: '100%' }}>
                View Order History
              </button>
            </div>

            <p
              className="text-muted"
              style={{ marginTop: '20px', fontSize: '0.7rem', textAlign: 'center' }}
            >
              📋 Data synced from Zoho CRM (Read-Only)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DealerLookup
