# Development Scripts Archive

This directory contains debugging and testing scripts that were used during the development of the Signal/Noise Foundation payment system but are no longer needed for production.

## Files Archived

### Test Scripts
- `test-*.js` - Various testing scripts for Stripe, Redis, email, and API functionality
- Used for debugging during development but not needed for production deployment

### Deprecated APIs
- `invoice.deprecated.js` - Old invoice generation logic replaced by secure token-based system

## Context

These scripts were essential for:
- Debugging webhook integration issues
- Testing Stripe payment flows
- Validating Redis data structures
- Testing email delivery systems
- Scenario testing for edge cases

## Current Production System

The production system now uses:
- **Primary Path**: `stripe-webhook.js` handling `checkout.session.completed` events
- **Backup Path**: `ensure-user-created.js` with grandfathering to prevent duplicates
- **Secure Invoices**: `invoice-secure.js` with token-based access
- **Email System**: Integrated Resend API with welcome email templates

All debugging functionality has been integrated into the production webhook logging system.

## Archive Date
September 2024 - After completion of Signal/Noise Foundation payment system