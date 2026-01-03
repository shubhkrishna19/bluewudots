import { describe, it, expect, vi, beforeEach } from 'vitest'
import WhatsAppService from '../whatsappService'

// Mock fetch globally
global.fetch = vi.fn()

describe('WhatsApp Integration (Meta Graph API)', () => {
  let whatsappService
  const MOCK_TOKEN = 'mock_valid_token'
  const MOCK_PHONE_ID = '123456789'

  beforeEach(() => {
    vi.clearAllMocks()
    whatsappService = new WhatsAppService(MOCK_TOKEN, 'biz_123', MOCK_PHONE_ID)
  })

  it('should build correct payload for Graph API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: 'wamid.test' }] }),
    })

    await whatsappService.sendWhatsAppMessage('ORD-123', 'hello_world', '919876543210')

    const callArgs = global.fetch.mock.calls[0]
    const url = callArgs[0]
    const options = callArgs[1]
    const body = JSON.parse(options.body)

    expect(url).toContain(`/${MOCK_PHONE_ID}/messages`)
    expect(options.headers['Authorization']).toBe(`Bearer ${MOCK_TOKEN}`)
    expect(body.messaging_product).toBe('whatsapp')
    expect(body.template.name).toBe('hello_world')
  })

  it('should handle complex template parameters', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: 'wamid.test' }] }),
    })

    const params = {
      header: ['Invoice #123'],
      body: ['John Doe', 'Rs. 500'],
    }

    await whatsappService.sendWhatsAppMessage('ORD-123', 'order_update', '919876543210', params)

    const body = JSON.parse(global.fetch.mock.calls[0][1].body)
    const components = body.template.components

    expect(components).toHaveLength(2)
    expect(components.find((c) => c.type === 'header')).toBeDefined()
    expect(components.find((c) => c.type === 'body').parameters[0].text).toBe('John Doe')
  })

  it('should throw specific error for invalid token (Code 190)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: { code: 190, message: 'Invalid OAuth access token.' },
      }),
    })

    const result = await whatsappService.sendWhatsAppMessage('ORD-123', 'test', '919876543210')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Authentication Failed')
  })

  it('should handle 24-hour window policy (Code 131030)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { code: 131030, message: 'Message failed to send.' },
      }),
    })

    const result = await whatsappService.sendWhatsAppMessage('ORD-123', 'test', '919876543210')
    expect(result.success).toBe(false)
    expect(result.error).toContain('24-hour customer service window')
  })
})
