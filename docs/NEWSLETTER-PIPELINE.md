# Newsletter Pipeline Implementation

**Status:** Implemented
**Date:** December 2025
**Phase:** 4.3 Marketing Automation

---

## Overview

Newsletter signups from the Vecia website are now automatically captured in Odoo Email Marketing via n8n webhooks.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEWSLETTER SIGNUP FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Website (vecia.fr)                    Tanguy's Server (100.124.143.6) │
│  ┌─────────────────────┐               ┌───────────────────────────┐   │
│  │ NewsletterPopup.astro│               │  n8n Workflow             │   │
│  │ ┌─────────────────┐  │               │  ┌─────────────────────┐  │   │
│  │ │ email input     │  │               │  │ 1. Validate Email   │  │   │
│  │ │ GDPR notice     │──┼───Funnel─────>│  │ 2. Check Duplicate  │  │   │
│  │ └─────────────────┘  │               │  │ 3. Create/Update    │  │   │
│  │                      │               │  │ 4. Telegram Notify  │  │   │
│  │ event_id generated   │               │  │ 5. Return Response  │  │   │
│  │ for CAPI dedup       │               │  └─────────────────────┘  │   │
│  └─────────────────────┘               │                           │   │
│                                         │  Odoo 17                  │   │
│                                         │  ┌─────────────────────┐  │   │
│                                         │  │ mailing.contact     │  │   │
│                                         │  │ Newsletter list #1  │  │   │
│                                         │  └─────────────────────┘  │   │
│                                         └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Website Form (NewsletterPopup.astro)

**Location:** `src/components/NewsletterPopup.astro`

**Features:**
- Appears after 30 seconds or on exit intent
- Client-side email validation
- Rate limiting (3 submissions/hour)
- GA4 event tracking
- Meta Pixel + LinkedIn tracking with event_id for CAPI deduplication

**Webhook URL (Tailscale Funnel - permanent):**
```
https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter
```

**Payload sent:**
```json
{
  "timestamp": "2025-12-10T18:40:00.000Z",
  "event_id": "vecia_1733855400_abc123xyz",
  "formType": "newsletter",
  "email": "user@example.com",
  "language": "fr",
  "source": "Direct",
  "trigger": "popup_modal",
  "utm_campaign": "",
  "utm_source": "",
  "utm_medium": "",
  "page_url": "https://vecia.fr/",
  "page_title": "Vecia - AI Automation Agency"
}
```

### 2. n8n Workflow

**Workflow ID:** `CLYEOLEV10lVuYLn`
**Name:** "Vecia Newsletter Signup"
**Location:** Tanguy's Server (100.124.143.6:5678)

**Flow:**
1. **Webhook** - Receives POST at `/webhook/vecia-newsletter`
2. **Validate & Transform** - Email validation, disposable email check
3. **Odoo Auth** - Authenticate with Tanguy's credentials
4. **Search Existing Contact** - Check if email exists in `mailing.contact`
5. **IF Contact Exists?** - Branch logic
   - **Yes:** Add to Newsletter list (command `[4, 1]`)
   - **No:** Create new `mailing.contact`
6. **Merge Result** - Combine results from both branches
7. **Telegram Notify** - Send notification to Vecia team
8. **Respond to Webhook** - Return success/error JSON

**Validation rules:**
- RFC 5322 email format
- Max 255 characters
- Blocks disposable domains: tempmail.com, guerrillamail.com, 10minutemail.com, mailinator.com, throwaway.email, yopmail.com

### 3. Odoo Configuration

**Database:** `vecia_prod`
**Mailing List:** "Newsletter" (ID: 1)
**Model:** `mailing.contact`

**Contact fields:**
- `name`: Email address (used as default name)
- `email`: Email address
- `list_ids`: Newsletter list reference `[1]`
- `create_date`: Auto-populated

---

## API Credentials

### Odoo API (used by n8n)

```
URL: http://100.124.143.6:8069/jsonrpc
Database: vecia_prod
User: tanguy.dray@vecia.fr
Password: VeciaAdmin2024!
UID: 2
```

### Telegram Bot

```
Bot Token: 7967131292:AAH8ZSTvT6aDzGXnbOa8YwtxtuWlJpUGz_E
Chat ID: -5067108668
```

---

## Testing

### Manual Webhook Test

```bash
curl -s "https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "language": "fr",
    "trigger": "manual_test"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "isNew": true
}
```

### Verify in Odoo

```bash
ssh odoo-server 'curl -s -X POST http://localhost:8069/jsonrpc \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"call\",
    \"params\": {
      \"service\": \"object\",
      \"method\": \"execute_kw\",
      \"args\": [
        \"vecia_prod\",
        2,
        \"VeciaAdmin2024!\",
        \"mailing.contact\",
        \"search_read\",
        [[[\"list_ids\", \"in\", [1]]]],
        {\"fields\": [\"id\", \"name\", \"email\", \"create_date\"]}
      ]
    },
    \"id\": 1
  }"'
```

---

## Known Limitations

1. ~~**ngrok URL is temporary**~~ - **RESOLVED**: Now using Tailscale Funnel with permanent URL.

2. **No welcome email automation** - Marketing Automation module is Enterprise-only. Options:
   - Configure SMTP in Odoo for manual sending
   - Add email sending to n8n workflow (requires SMTP credentials)
   - Use third-party service (SendGrid, Mailchimp)

3. **Error responses** - Validation errors return empty response instead of JSON error. Does not affect functionality.

---

## Related Files

| File | Purpose |
|------|---------|
| `src/components/NewsletterPopup.astro` | Frontend newsletter form |
| `src/config.ts` | Webhook URL configuration |
| `n8n-workflows/vecia-newsletter-signup.json` | n8n workflow export |
| `docs/TAILSCALE-FUNNEL-N8N-SETUP.md` | Permanent URL setup guide |

---

## Future Improvements

1. ~~**Tailscale Funnel**~~ - **DONE**: Permanent URL active
2. **Welcome email sequence** - 3-5 emails over 14 days
3. **Meta CAPI integration** - Server-side Subscribe event
4. **Double opt-in** - Confirmation email flow (GDPR compliance)
5. **Lead scoring** - Based on email engagement

---

## Monitoring

- **Telegram notifications** - Real-time alerts for new signups
- **n8n execution logs** - http://100.124.143.6:5678 (password: N8nVecia2025!Admin)
- **Odoo contacts** - http://100.124.143.6:8069/web#model=mailing.contact
