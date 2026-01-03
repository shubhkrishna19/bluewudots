/**
 * validate-env.js
 * Validates that all required environment variables are present for the current mode.
 * Prevents build/dev if critical keys are missing.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REQUIRED_VARS = [
  'VITE_AMAZON_SELLER_ID',
  'VITE_AMAZON_ACCESS_TOKEN',
  'VITE_FLIPKART_APP_ID',
  'VITE_FLIPKART_ACCESS_TOKEN',
  'VITE_WHATSAPP_API_TOKEN',
  'VITE_ZOHO_CLIENT_ID',
]

function validate() {
  console.log('🔍 Validating Environment Variables...')

  // Check .env file if it exists
  const envPath = path.resolve(__dirname, '../.env')
  let envContent = ''

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  const missing = []
  REQUIRED_VARS.forEach((v) => {
    // Check process.env OR .env file content
    const isInProcess = process.env[v]
    const isInFile = envContent.includes(`${v}=`)

    if (!isInProcess && !isInFile) {
      missing.push(v)
    }
  })

  if (missing.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '❌ CRITICAL ERROR: Missing Required Environment Variables:')
    missing.forEach((m) => console.error(`   - ${m}`))
    console.error('\nPlease update your .env file or environment settings before proceeding.')
    process.exit(1)
  }

  console.log('\x1b[32m%s\x1b[0m', '✅ All required environment variables found.')
}

validate()
