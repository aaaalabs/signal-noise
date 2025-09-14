# Development Documentation Archive

This directory contains development documentation that was used during the Signal/Noise Foundation payment system development but is now outdated or superseded.

## Archived Documentation

### Email System Development
- `EMAIL_TEMPLATE_REPORT.md` - Analysis of email template integration during development
- `EMAIL_TEMPLATE_ANALYSIS.md` - Detailed email template testing documentation
- `RESEND-DOMAIN-SETUP.md` - Domain setup instructions for Resend integration

### Stripe Integration Development
- `stripe-cli-test.md` - Stripe CLI testing procedures
- `stripe-test-manual.md` - Manual Stripe testing workflows
- `STRIPE-TEST-GUIDE.md` - Comprehensive Stripe testing guide
- `README_STRIPE_SETUP.md` - Stripe setup instructions

### Data Schema Development
- `lib_invoice-schema.md` - Old invoice schema documentation (replaced by secure token system)

## Current Production Documentation

The up-to-date documentation is now in:
- `lessons-learned.md` - Complete technical lessons and production architecture
- `CLAUDE.md` - Project setup and development guidelines
- `README.md` - Current project overview
- `ROLLOUT.md` - Deployment procedures

## Context

These documents were essential during development for:
- Setting up Stripe webhook testing workflows
- Configuring email domain authentication
- Testing invoice generation systems
- Documenting API schema iterations
- Manual testing procedures

## Production Status

The production system now has:
- **Complete Stripe Integration**: Working webhooks with `checkout.session.completed` events
- **Email System**: Automated welcome emails via Resend API
- **Invoice Generation**: Secure token-based invoice access
- **Foundation Pricing**: €29/€49 tiered lifetime access

All development workflows have been integrated into the production deployment process.

## Archive Date
September 2024 - After completion of Signal/Noise Foundation payment system