import { vi } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';

global.indexedDB = indexedDB;
global.IDBKeyRange = IDBKeyRange;

// Mock import.meta.env for Vitest
vi.stubGlobal('import.meta', {
    env: {
        VITE_DELHIVERY_TOKEN: 'mock-token',
        VITE_ZOHO_CLIENT_ID: 'mock-client',
        VITE_WHATSAPP_API_TOKEN: 'mock-whatsapp-token',
        VITE_ZOHO_WEBHOOK_SECRET: 'mock-secret',
    },
})
