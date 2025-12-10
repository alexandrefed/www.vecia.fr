# Tailscale Funnel Setup for n8n Webhooks

**For:** Tanguy
**Server:** Tanguy's Server (100.124.143.6)
**Date:** December 2024
**Priority:** High - Required for production webhook stability

---

## ⚠️ IMPORTANT: This is for Tanguy's Server, NOT Alex's VPS

**Two-Server Architecture:**
- **Alex's VPS (85.25.172.47)** - Hosts the website (vecia.fr)
- **Tanguy's Server (100.124.143.6)** - Hosts Odoo + n8n for marketing workflows

The website forms send data TO Tanguy's server where n8n processes leads and stores them in Odoo.

Tailscale Funnel needs to be installed on **Tanguy's server** to expose n8n webhooks to the internet.

---

## Why We Need Tailscale Funnel

### The Problem

Currently, website forms (on Alex's VPS) send data to n8n (on Tanguy's server) using **ngrok tunnels**:

```
Alex's VPS (Website Form) → ngrok URL → Tanguy's Server (n8n → Odoo CRM)
```

**Issues with ngrok:**
1. **URL changes on restart** - Every time ngrok restarts, we get a new URL
2. **Manual updates required** - Alex needs to update website env vars each time
3. **Unreliable for production** - Forms fail when tunnel is down
4. **Free tier limitations** - Rate limits, session timeouts

### The Solution: Tailscale Funnel

Tailscale Funnel provides a **permanent, stable HTTPS URL** for n8n on Tanguy's server:

```
Alex's VPS (Website Form) → https://tanguy-server.tailnet.ts.net/webhook/... → n8n → Odoo CRM
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
┌───────────────────────────────────────────────────────────────────────────────┐
│                        CURRENT (ngrok) - TEMPORARY                             │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ALEX'S VPS (85.25.172.47)          TANGUY'S SERVER (100.124.143.6)         │
│   ┌─────────────────────┐            ┌─────────────────────────────┐         │
│   │  vecia.fr           │            │  n8n (port 5678)            │         │
│   │  ┌──────────────┐   │   ngrok    │  ┌─────────────────────┐    │         │
│   │  │ Form Submit  │───┼──────────> │  │ Webhook Receiver    │    │         │
│   │  └──────────────┘   │  (temp!)   │  │  ├─> Create Lead    │    │         │
│   │                     │            │  │  └─> Odoo CRM       │    │         │
│   └─────────────────────┘            │  └─────────────────────┘    │         │
│                                      │                             │         │
│              ⚠️ ngrok URL changes on restart!                      │         │
└───────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────┐
│                    TARGET (Tailscale Funnel) - PERMANENT                       │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ALEX'S VPS (85.25.172.47)          TANGUY'S SERVER (100.124.143.6)         │
│   ┌─────────────────────┐            ┌─────────────────────────────┐         │
│   │  vecia.fr           │  Tailscale │  n8n (port 5678)            │         │
│   │  ┌──────────────┐   │   Funnel   │  ┌─────────────────────┐    │         │
│   │  │ Form Submit  │───┼──────────> │  │ Webhook Receiver    │    │         │
│   │  └──────────────┘   │ (permanent)│  │  ├─> Create Lead    │    │         │
│   │                     │            │  │  └─> Odoo CRM       │    │         │
│   └─────────────────────┘            │  └─────────────────────┘    │         │
│                                      │                             │         │
│              ✅ tanguy-server.tailnet.ts.net (never changes!)      │         │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Current Webhook URLs (to be replaced)

| Purpose | Current ngrok URL | Target Tailscale URL |
|---------|-------------------|---------------------|
| Lead forms | `https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-lead` | `https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-lead` |
| Newsletter | `https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-newsletter` | `https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-newsletter` |

**Note:** Replace `[TANGUY-SERVER]` with the machine name that Tailscale assigns to Tanguy's server, and `[TAILNET]` with the tailnet name.

---

## Setup Instructions (on Tanguy's Server)

### Prerequisites

- [ ] **Tanguy's server** (100.124.143.6) with n8n running on port 5678
- [ ] SSH access: `ssh odoo-server` or `ssh axelor@100.124.143.6`
- [ ] sudo/root access on the server
- [ ] Tailscale account (free tier works)
- [ ] Admin access to Tailscale admin console

### Step 1: Install Tailscale on Tanguy's Server

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

### Step 6: Notify Alex to Update Website Environment Variables

Once Funnel is working on Tanguy's server, Alex will need to update the website configuration on his VPS (85.25.172.47):

**On Alex's VPS - Update `.env`:**

```env
PUBLIC_N8N_LEAD_WEBHOOK=https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-lead
PUBLIC_N8N_NEWSLETTER_WEBHOOK=https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-newsletter
```

**Or update `src/config.ts` directly:**

```typescript
n8n: {
  leadWebhookUrl: 'https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-lead',
  newsletterWebhookUrl: 'https://[TANGUY-SERVER].[TAILNET].ts.net/webhook/vecia-newsletter',
},
```

Then rebuild and deploy the website on Alex's VPS.

---

## Verification Checklist (Tanguy's Server)

After setup on Tanguy's server (100.124.143.6), verify everything works:

- [ ] `tailscale status` shows connected
- [ ] `tailscale funnel status` shows n8n exposed on port 5678
- [ ] Can access `https://[TANGUY-SERVER].[TAILNET].ts.net` from browser (shows n8n UI)
- [ ] Webhook test curl command returns success from **external machine**
- [ ] Website form submission reaches n8n (check n8n execution logs)
- [ ] Lead appears in Odoo CRM (http://100.124.143.6:8069)

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

## After Setup: Tanguy Notifies Alex

Once Tailscale Funnel is working on Tanguy's server, provide Alex with:

1. **The permanent Funnel URL**: `https://[TANGUY-SERVER].[TAILNET].ts.net`
2. **Confirmation** that `/webhook/vecia-lead` endpoint is accessible from internet
3. **Confirmation** that `/webhook/vecia-newsletter` endpoint is accessible from internet

Alex will then (on his VPS 85.25.172.47):
1. Update the website `.env` with new webhook URLs
2. Rebuild and deploy the website
3. Test form submissions end-to-end
4. Once confirmed working, Tanguy can remove ngrok container

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
