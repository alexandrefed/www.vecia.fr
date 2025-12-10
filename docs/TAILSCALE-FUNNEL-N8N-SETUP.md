# Tailscale Funnel Setup for n8n Webhooks

**For:** Tanguy
**Date:** December 2024
**Priority:** High - Required for production webhook stability

---

## Why We Need Tailscale Funnel

### The Problem

Currently, our website forms (lead capture, contact, newsletter) send data to n8n webhooks using **ngrok tunnels**:

```
Website Form → ngrok URL → n8n → Odoo CRM
```

**Issues with ngrok:**
1. **URL changes on restart** - Every time ngrok restarts, we get a new URL
2. **Manual updates required** - Need to update environment variables each time
3. **Unreliable for production** - Forms fail when tunnel is down
4. **Free tier limitations** - Rate limits, session timeouts

### The Solution: Tailscale Funnel

Tailscale Funnel provides a **permanent, stable HTTPS URL** for n8n:

```
Website Form → https://vps-name.tailnet.ts.net/webhook/... → n8n → Odoo CRM
```

**Benefits:**
- **Permanent URL** - Never changes, even after restarts
- **Automatic HTTPS** - TLS certificates managed by Tailscale
- **Zero configuration** - No firewall rules needed
- **Always on** - Runs as background service
- **Free** - Included with Tailscale

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CURRENT (ngrok)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  vecia.fr      ngrok URL (changes!)        VPS                  │
│  ┌──────┐     ┌──────────────────┐      ┌─────────┐             │
│  │ Form │ ──> │ xxx.ngrok-free.  │ ──>  │  n8n    │ ──> Odoo    │
│  └──────┘     │ dev/webhook/...  │      │ :5678   │             │
│               └──────────────────┘      └─────────┘             │
│                       ⚠️ URL changes on restart!                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    TARGET (Tailscale Funnel)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  vecia.fr      Tailscale Funnel (permanent!)   VPS              │
│  ┌──────┐     ┌──────────────────────────┐  ┌─────────┐         │
│  │ Form │ ──> │ vps.tailnet-name.ts.net  │──│  n8n    │ ──> Odoo│
│  └──────┘     │ /webhook/vecia-lead      │  │ :5678   │         │
│               └──────────────────────────┘  └─────────┘         │
│                       ✅ Permanent URL!                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current Webhook URLs (to be replaced)

| Purpose | Current ngrok URL | Target Tailscale URL |
|---------|-------------------|---------------------|
| Lead forms | `https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-lead` | `https://[VPS-NAME].[TAILNET].ts.net/webhook/vecia-lead` |
| Newsletter | `https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-newsletter` | `https://[VPS-NAME].[TAILNET].ts.net/webhook/vecia-newsletter` |

---

## Setup Instructions

### Prerequisites

- [ ] VPS with n8n running on port 5678
- [ ] sudo/root access on the VPS
- [ ] Tailscale account (free tier works)
- [ ] Admin access to Tailscale admin console

### Step 1: Install Tailscale on VPS

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Enable and start the service
sudo systemctl enable --now tailscaled

# Authenticate (follow the URL that appears)
sudo tailscale up

# Verify connection
tailscale status
```

### Step 2: Enable Funnel in Tailnet Policy

Go to **Tailscale Admin Console** → **Access Controls** and add this to your policy:

```json
{
  "nodeAttrs": [
    {
      "target": ["autogroup:members"],
      "attr": ["funnel"]
    }
  ]
}
```

This allows all Tailnet members to use Funnel on their nodes.

### Step 3: Expose n8n via Funnel

```bash
# Test (foreground - Ctrl+C to stop)
sudo tailscale funnel 5678

# You'll see output like:
# Available on the internet:
# https://your-vps-name.your-tailnet.ts.net
# |-- / proxy http://127.0.0.1:5678
```

### Step 4: Run Funnel in Background (Persistent)

```bash
# Enable background mode (survives restarts)
sudo tailscale funnel --bg 5678

# Verify it's running
tailscale funnel status
```

### Step 5: Test the Webhook

```bash
# From any machine, test the n8n endpoint
curl -X POST https://[YOUR-VPS].[YOUR-TAILNET].ts.net/webhook/vecia-lead \
  -H "Content-Type: application/json" \
  -d '{"test": true, "email": "test@example.com"}'
```

### Step 6: Update Website Environment Variables

Once Funnel is working, we need to update the website configuration:

**Option A: Environment Variables (Recommended)**

In the deployment environment (Vercel, Cloudflare, or VPS):

```env
PUBLIC_N8N_LEAD_WEBHOOK=https://[YOUR-VPS].[YOUR-TAILNET].ts.net/webhook/vecia-lead
PUBLIC_N8N_NEWSLETTER_WEBHOOK=https://[YOUR-VPS].[YOUR-TAILNET].ts.net/webhook/vecia-newsletter
```

**Option B: Direct Code Update (Temporary)**

Update `src/config.ts`:

```typescript
n8n: {
  leadWebhookUrl: 'https://[YOUR-VPS].[YOUR-TAILNET].ts.net/webhook/vecia-lead',
  newsletterWebhookUrl: 'https://[YOUR-VPS].[YOUR-TAILNET].ts.net/webhook/vecia-newsletter',
},
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] `tailscale status` shows connected
- [ ] `tailscale funnel status` shows n8n exposed on port 5678
- [ ] Can access `https://[VPS].[TAILNET].ts.net` from browser (shows n8n UI)
- [ ] Webhook test curl command returns success
- [ ] Website form submission reaches n8n (check n8n execution logs)
- [ ] Lead appears in Odoo CRM

---

## Troubleshooting

### Funnel not working

```bash
# Check if tailscaled is running
sudo systemctl status tailscaled

# Check if n8n is running locally
curl http://localhost:5678

# Check funnel status
tailscale funnel status

# View logs
sudo journalctl -u tailscaled -f
```

### Permission denied

```bash
# Ensure funnel attribute is set in Tailnet policy
# Check admin console: Access Controls → nodeAttrs
```

### n8n not receiving requests

```bash
# Check n8n is listening on 5678
sudo ss -tlnp | grep 5678

# Test local connectivity first
curl -X POST http://localhost:5678/webhook/vecia-lead \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Firewall issues

```bash
# Allow Tailscale UDP port (usually auto-configured)
sudo ufw allow 41641/udp

# Or disable ufw temporarily to test
sudo ufw disable
```

---

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `tailscale status` | Check Tailscale connection status |
| `tailscale ip -4` | Get Tailscale IPv4 address |
| `tailscale funnel status` | Check what's being exposed |
| `tailscale funnel 5678` | Expose port 5678 (foreground) |
| `tailscale funnel --bg 5678` | Expose port 5678 (background) |
| `tailscale funnel 5678 off` | Stop exposing port 5678 |
| `tailscale funnel reset` | Remove all funnel configuration |
| `sudo systemctl restart tailscaled` | Restart Tailscale daemon |

---

## After Setup: Notify Alex

Once Tailscale Funnel is working, please provide:

1. **The permanent Funnel URL**: `https://[VPS-NAME].[TAILNET].ts.net`
2. **Confirmation** that `/webhook/vecia-lead` endpoint is accessible
3. **Confirmation** that `/webhook/vecia-newsletter` endpoint is accessible

Alex will then:
1. Update the website environment variables
2. Test form submissions end-to-end
3. Remove ngrok dependency

---

## Security Notes

- Tailscale Funnel URLs are **publicly accessible** - anyone with the URL can send requests
- n8n webhooks should validate incoming data (already implemented)
- Consider adding webhook secrets/authentication in n8n workflows for extra security
- Monitor n8n execution logs for suspicious activity

---

## Related Documentation

- [Tailscale Funnel Docs](https://tailscale.com/kb/1223/funnel)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- Project: `/docs/CAL-ODOO-INTEGRATION-GUIDE.md` - n8n workflow details
