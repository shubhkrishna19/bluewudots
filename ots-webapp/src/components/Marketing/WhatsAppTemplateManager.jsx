import React, { useState, useEffect } from 'react'
import { Share2, Send, MessageSquare, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { getWhatsAppService } from '../../services/whatsappService'

const WhatsAppTemplateManager = () => {
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [testPhone, setTestPhone] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [sendResult, setSendResult] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [serviceStatus, setServiceStatus] = useState({ mode: 'unknown', connected: false })

  const whatsapp = getWhatsAppService()

  useEffect(() => {
    loadTemplates()
    setServiceStatus({
      mode: whatsapp.isSimulationMode ? 'SIMULATION' : 'LIVE',
      connected: !!whatsapp.apiToken,
    })
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    // In a real app, fetch these from the WhatsApp API
    // For now, we mock the approved templates configuration
    await new Promise((resolve) => setTimeout(resolve, 800))
    setTemplates([
      {
        id: 'order_confirmation',
        name: 'order_confirmation_v2',
        language: 'en_US',
        status: 'APPROVED',
        category: 'TRANSACTIONAL',
        components: [
          { type: 'HEADER', format: 'TEXT', text: 'Order Confirmation' },
          {
            type: 'BODY',
            text: 'Hi {{1}}, thank you for your order #{{2}}. We have received your payment of ₹{{3}}. We will notify you once it ships.',
          },
          { type: 'FOOTER', text: 'Bluewud Furniture' },
        ],
        params: ['Customer Name', 'Order ID', 'Amount'],
      },
      {
        id: 'shipment_update',
        name: 'shipment_shipped',
        language: 'en_US',
        status: 'APPROVED',
        category: 'TRANSACTIONAL',
        components: [
          { type: 'HEADER', format: 'IMAGE' },
          {
            type: 'BODY',
            text: 'Great news {{1}}! Your order #{{2}} has been shipped via {{3}}. Track it here: {{4}}',
          },
        ],
        params: ['Customer Name', 'Order ID', 'Carrier', 'Tracking Link'],
      },
      {
        id: 'payment_reminder',
        name: 'payment_pending_cod',
        language: 'en_US',
        status: 'APPROVED',
        category: 'UTILITY',
        components: [
          {
            type: 'BODY',
            text: 'Hello {{1}}, your COD order #{{2}} is pending verification. Please confirm to proceed.',
          },
          { type: 'BUTTONS', buttons: ['Confirm Order', 'Cancel Order'] },
        ],
        params: ['Customer Name', 'Order ID'],
      },
    ])
    setIsLoading(false)
  }

  const handleSendTest = async () => {
    if (!testPhone || !selectedTemplate) return

    setIsSending(true)
    setSendResult(null)

    try {
      // Mock parameters based on template requirements
      const mockParams = {}
      if (selectedTemplate.name === 'order_confirmation_v2') {
        mockParams.body = ['Test User', 'ORD-999', '15000']
      } else if (selectedTemplate.name === 'shipment_shipped') {
        mockParams.header = ['https://via.placeholder.com/300']
        mockParams.body = ['Test User', 'ORD-999', 'BlueDart', 'https://track.com/123']
      } else {
        mockParams.body = ['Test User', 'ORD-999']
      }

      const result = await whatsapp.sendWhatsAppMessage(
        'TEST-001',
        selectedTemplate.name,
        testPhone,
        mockParams
      )

      setSendResult(result)
    } catch (error) {
      setSendResult({ success: false, error: error.message })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6 text-green-500" />
            WhatsApp Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage templates and test API connectivity</p>
        </div>
        <div className="flex gap-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border ${serviceStatus.mode === 'LIVE' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-yellow-500 text-yellow-500 bg-yellow-500/10'}`}
          >
            {serviceStatus.mode} MODE
          </div>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={loadTemplates}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Approved Templates</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-green-500/10 border-green-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${template.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                      >
                        {template.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Language: {template.language} • Category: {template.category}
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-black/20 p-3 rounded text-sm text-slate-300 font-mono">
                  {template.components.find((c) => c.type === 'BODY')?.text}
                </div>
                {template.params && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {template.params.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-0.5 bg-slate-700 rounded text-slate-300"
                      >
                        {`{{${p}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Test Console */}
        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl h-fit sticky top-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" /> Test Console
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Template</label>
              <div className="p-2 bg-black/40 rounded text-sm text-slate-300 border border-white/10">
                {selectedTemplate ? selectedTemplate.name : 'Select a template from the list'}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Recipient Phone (with country code)
              </label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:border-green-500 outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleSendTest}
              disabled={!selectedTemplate || !testPhone || isSending}
              className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
            >
              {isSending ? 'Sending...' : 'Send Test Message'}
            </button>

            {sendResult && (
              <div
                className={`mt-4 p-3 rounded text-sm border ${sendResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {sendResult.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`font-bold ${sendResult.success ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {sendResult.success ? 'Message Sent' : 'Failed to Send'}
                  </span>
                </div>
                {sendResult.success ? (
                  <p className="text-slate-400 text-xs">ID: {sendResult.messageId}</p>
                ) : (
                  <p className="text-red-400 text-xs">{sendResult.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppTemplateManager
