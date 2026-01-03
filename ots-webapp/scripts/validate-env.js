#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates all required environment variables before deployment
 * Usage: node scripts/validate-env.js [--env production|staging]
 */

const fs = require('fs')
const path = require('path')

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// Required environment variables with descriptions
const REQUIRED_VARS = {
  // Core Application
  VITE_APP_NAME: {
    description: 'Application name',
    example: 'Bluewud OTS',
    required: false,
  },

  // WhatsApp Integration
  VITE_WHATSAPP_API_TOKEN: {
    description: 'WhatsApp Business API token',
    example: 'EAAxxxxxxxxxxxxxxx',
    required: false,
    validate: (val) => val && val.length > 20,
  },
  VITE_WHATSAPP_BUSINESS_ID: {
    description: 'WhatsApp Business Account ID',
    example: '123456789012345',
    required: false,
  },
  VITE_WHATSAPP_PHONE_ID: {
    description: 'WhatsApp Phone Number ID',
    example: '987654321098765',
    required: false,
  },

  // Marketplace Integration
  VITE_AMAZON_SELLER_ID: {
    description: 'Amazon Seller Central ID',
    example: 'A1XXXXXXXXXXXXX',
    required: false,
  },
  VITE_AMAZON_ACCESS_TOKEN: {
    description: 'Amazon SP-API Access Token',
    example: 'Atza|IwEBxxxxxxxx',
    required: false,
  },
  VITE_FLIPKART_APP_ID: {
    description: 'Flipkart Marketplace App ID',
    example: 'fk_xxxxxxxxxxxxxxxx',
    required: false,
  },
  VITE_FLIPKART_ACCESS_TOKEN: {
    description: 'Flipkart API Access Token',
    example: 'Bearer xxxxxxxx',
    required: false,
  },

  // Logistics
  VITE_DELHIVERY_API_TOKEN: {
    description: 'Delhivery API Token',
    example: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    required: false,
  },

  // Zoho Integration
  VITE_CATALYST_PROJECT_ID: {
    description: 'Zoho Catalyst Project ID',
    example: '1234567890',
    required: false,
  },

  // Security
  VITE_IP_WHITELIST_ENABLED: {
    description: 'Enable IP whitelisting',
    example: 'true',
    required: false,
    validate: (val) => val === 'true' || val === 'false',
  },
  VITE_ENCRYPTION_KEY: {
    description: 'AES encryption key for sensitive data',
    example: 'your-32-char-encryption-key-here',
    required: false,
    validate: (val) => !val || val.length >= 32,
  },
}

class EnvValidator {
  constructor(environment = 'development') {
    this.environment = environment
    this.errors = []
    this.warnings = []
    this.info = []
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
  }

  loadEnvFile() {
    const envFiles = [
      `.env.${this.environment}`,
      `.env.${this.environment}.local`,
      '.env',
      '.env.local',
    ]

    for (const file of envFiles) {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        this.info.push(`Found env file: ${file}`)
        return true
      }
    }

    this.warnings.push(`No .env file found for environment: ${this.environment}`)
    return false
  }

  validateVariable(key, config) {
    const value = process.env[key]

    if (!value) {
      if (config.required) {
        this.errors.push({
          key,
          message: `Missing required variable: ${key}`,
          description: config.description,
          example: config.example,
        })
      } else {
        this.warnings.push(`Optional variable not set: ${key} (${config.description})`)
      }
      return false
    }

    // Custom validation
    if (config.validate && !config.validate(value)) {
      this.errors.push({
        key,
        message: `Invalid value for ${key}`,
        description: config.description,
        example: config.example,
      })
      return false
    }

    return true
  }

  validate() {
    this.log('\n🔍 Environment Validation', 'cyan')
    this.log('='.repeat(50), 'cyan')
    this.log(`Environment: ${this.environment}`, 'blue')
    this.log('')

    // Load env file
    this.loadEnvFile()

    // Validate each variable
    let validCount = 0
    let totalRequired = 0

    for (const [key, config] of Object.entries(REQUIRED_VARS)) {
      if (config.required) totalRequired++
      if (this.validateVariable(key, config)) {
        validCount++
      }
    }

    // Print results
    this.log('\n📊 Validation Results', 'cyan')
    this.log('='.repeat(50), 'cyan')

    if (this.errors.length > 0) {
      this.log(`\n❌ Errors (${this.errors.length}):`, 'red')
      this.errors.forEach((err) => {
        this.log(`\n  ${err.key}:`, 'red')
        this.log(`    ${err.message}`, 'red')
        this.log(`    Description: ${err.description}`, 'yellow')
        this.log(`    Example: ${err.example}`, 'yellow')
      })
    }

    if (this.warnings.length > 0) {
      this.log(`\n⚠️  Warnings (${this.warnings.length}):`, 'yellow')
      this.warnings.forEach((warn) => {
        this.log(`  • ${warn}`, 'yellow')
      })
    }

    if (this.info.length > 0) {
      this.log(`\nℹ️  Info:`, 'blue')
      this.info.forEach((info) => {
        this.log(`  • ${info}`, 'blue')
      })
    }

    this.log(`\n✅ Valid variables: ${validCount}/${Object.keys(REQUIRED_VARS).length}`, 'green')
    this.log(`📋 Required variables: ${totalRequired}`, 'blue')

    // Final verdict
    this.log('\n' + '='.repeat(50), 'cyan')
    if (this.errors.length === 0) {
      this.log('✅ Environment validation PASSED', 'green')
      this.log('')
      return true
    } else {
      this.log('❌ Environment validation FAILED', 'red')
      this.log(`   Fix ${this.errors.length} error(s) before deployment`, 'red')
      this.log('')
      return false
    }
  }

  generateTemplate() {
    this.log('\n📝 Generating .env template...', 'cyan')

    let template = '# Bluewud OTS Environment Variables\n'
    template += '# Generated by validate-env.js\n\n'

    for (const [key, config] of Object.entries(REQUIRED_VARS)) {
      template += `# ${config.description}\n`
      template += `# Example: ${config.example}\n`
      template += `${config.required ? '' : '# '}${key}=\n\n`
    }

    const templatePath = path.join(process.cwd(), '.env.template')
    fs.writeFileSync(templatePath, template)
    this.log(`✅ Template generated: .env.template`, 'green')
  }
}

// CLI
const args = process.argv.slice(2)
const envArg = args.find((arg) => arg.startsWith('--env='))
const environment = envArg ? envArg.split('=')[1] : 'development'
const shouldGenerateTemplate = args.includes('--generate-template')

const validator = new EnvValidator(environment)

if (shouldGenerateTemplate) {
  validator.generateTemplate()
} else {
  const isValid = validator.validate()
  process.exit(isValid ? 0 : 1)
}
