# Google Sheets Lead Capture Webhook Setup Guide

**Purpose**: Configure a Google Sheets spreadsheet to receive form submissions from the LeadCaptureForm component.

**Time Required**: 15 minutes
**Cost**: Free
**Technical Level**: Beginner-friendly

---

## 📊 What You'll Build

A simple webhook that:
1. Receives lead data from your website form
2. Automatically adds each submission as a new row in Google Sheets
3. Timestamps each entry
4. Captures UTM parameters for source tracking

---

## 🚀 Step-by-Step Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it: **"Vecia - Lead Capture Form"**

4. **Set up column headers** in Row 1:
   ```
   A: Timestamp
   B: Name
   C: Email
   D: Company Size
   E: Language
   F: Source
   G: UTM Campaign
   H: UTM Source
   I: UTM Medium
   J: Page URL
   ```

5. **Format the sheet**:
   - Select Row 1 → Make it **bold**
   - Select Column A → Format → Number → **Date time**
   - Freeze Row 1: View → Freeze → **1 row**

---

### Step 2: Create the Apps Script Webhook

1. In your Google Sheet, click **Extensions → Apps Script**

2. **Delete** the default code (function myFunction...)

3. **Paste this webhook code**:

```javascript
/**
 * Vecia Lead Capture Webhook
 * Receives form submissions and appends them to the spreadsheet
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Create a new row with the data
    const row = [
      new Date(data.timestamp),       // A: Timestamp
      data.name || '',                 // B: Name
      data.email || '',                // C: Email
      data.companySize || '',          // D: Company Size
      data.language || 'unknown',      // E: Language
      data.source || 'Direct',         // F: Source (Referrer)
      data.utm_campaign || '',         // G: UTM Campaign
      data.utm_source || '',           // H: UTM Source
      data.utm_medium || '',           // I: UTM Medium
      data.page_url || ''              // J: Page URL
    ];

    // Append the row to the sheet
    sheet.appendRow(row);

    // Optional: Send confirmation email to admin
    // Uncomment the lines below and add your email
    /*
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: '🔔 New Lead: ' + data.name,
      body: 'Name: ' + data.name + '\nEmail: ' + data.email + '\nCompany Size: ' + data.companySize
    });
    */

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Lead captured' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the webhook works
 * Run this from the Apps Script editor to test
 */
function testWebhook() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: 'test@example.com',
        companySize: '11-50',
        language: 'fr',
        source: 'Test',
        utm_campaign: 'test',
        utm_source: 'manual',
        utm_medium: 'test',
        page_url: 'http://localhost:4321/test-lead-capture'
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. **Save the script**:
   - Click the **floppy disk icon** or press `Ctrl/Cmd + S`
   - Name it: **"Lead Capture Webhook"**

---

### Step 3: Deploy the Webhook

1. Click **Deploy → New deployment**

2. **Configure the deployment**:
   - Click the **gear icon** next to "Select type"
   - Choose **"Web app"**

3. **Fill in deployment settings**:
   - **Description**: `Vecia Lead Capture v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` (⚠️ Important!)

4. Click **Deploy**

5. **Authorize the script**:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to Lead Capture Webhook (unsafe)** (it's safe, it's your own script)
   - Click **Allow**

6. **Copy the Web App URL**:
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycbx.../exec`
   - **Copy this entire URL** - you'll need it for the next step

---

### Step 4: Test the Webhook

1. In the Apps Script editor, click the **testWebhook** function from the dropdown

2. Click **Run** (play button icon)

3. Go back to your Google Sheet

4. You should see a new row with test data:
   ```
   Timestamp: [current date/time]
   Name: Test User
   Email: test@example.com
   Company Size: 11-50
   Language: fr
   Source: Test
   ```

5. ✅ If you see the test data → **Webhook is working!**

---

### Step 5: Connect Webhook to Your Website

1. Open the Alpine.js script file:
   ```
   src/scripts/alpine.ts
   ```

2. Find this line (around line 45):
   ```javascript
   const WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL';
   ```

3. Replace it with your copied URL:
   ```javascript
   const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

4. Save the file

5. Restart your dev server:
   ```bash
   npm run dev
   ```

**Note**: The form logic is registered in `src/scripts/alpine.ts` as an Alpine.js component, not in the component file itself. This is the 2025 best practice for npm-installed Alpine.js.

---

### Step 6: Test End-to-End

1. Visit the test page: http://localhost:4321/test-lead-capture

2. Fill in the form with test data:
   - Name: Jean Dupont
   - Email: jean.dupont@example.com
   - Company Size: 11-50 employés

3. Click **"Obtenir Mon Évaluation Gratuite"**

4. You should see:
   - ✅ Green success message appears
   - Check your Google Sheet → New row added

5. Verify the data in Google Sheets matches your form input

---

## 🔧 Troubleshooting

### Issue: "Script not authorized" error
**Solution**:
- Go back to Step 3 and complete the authorization process
- Make sure **"Who has access"** is set to **"Anyone"**

### Issue: No data appearing in Google Sheets
**Solution**:
1. Check the Apps Script logs:
   - Apps Script editor → Executions (left sidebar)
   - Look for errors in recent executions
2. Make sure the WEBHOOK_URL in your component matches the deployed URL exactly
3. Try the testWebhook() function again

### Issue: CORS errors in browser console
**Solution**:
- This is normal! The `mode: 'no-cors'` in the fetch request handles this
- The form will still submit successfully even with CORS warnings

### Issue: Duplicate submissions
**Solution**:
- Add a unique ID check in the script
- Use the email + timestamp as a composite key
- Or: Add client-side localStorage check to prevent double-clicks

---

## 📈 Next Steps: Upgrade to Email Automation

Once you have 20+ leads, consider migrating to **Brevo (Sendinblue)** for:
- ✅ Automated email sequences
- ✅ Lead scoring
- ✅ CRM features
- ✅ Free tier: Unlimited contacts, 300 emails/day

**Migration Path**:
1. Export Google Sheets as CSV
2. Sign up for Brevo: https://www.brevo.com
3. Import CSV to Brevo contacts
4. Create email automation workflow
5. Update webhook URL in component (or use Zapier to connect both)

---

## 📊 Data Fields Captured

| Field | Example | Purpose |
|-------|---------|---------|
| **Timestamp** | 2025-10-07 14:32:15 | When form was submitted |
| **Name** | Jean Dupont | Lead's full name |
| **Email** | jean@example.com | Primary contact method |
| **Company Size** | 11-50 | Lead qualification |
| **Language** | fr / en | Communication preference |
| **Source** | https://linkedin.com | Referrer URL (traffic source) |
| **UTM Campaign** | linkedin-oct-2025 | Marketing campaign tracking |
| **UTM Source** | linkedin | Traffic source |
| **UTM Medium** | social | Traffic medium |
| **Page URL** | https://vecia.fr/ | Where form was submitted |

---

## 🔐 Security Best Practices

### Current Setup (Good for MVP):
- ✅ Anyone can POST to webhook (required for form submissions)
- ✅ Data stored in private Google Sheet (only you have access)
- ✅ No sensitive data collected (just name, email, company size)

### For Production (Recommended):
1. **Add honeypot field** to prevent spam bots
2. **Rate limiting**: Track IP addresses and limit to 3 submissions/hour
3. **Email validation**: Verify email format server-side
4. **CAPTCHA**: Add reCAPTCHA v3 for high-traffic sites

### Optional: Add Honeypot Field

Add this to LeadCaptureForm.astro (before the submit button):

```html
<!-- Honeypot field (hidden from humans, visible to bots) -->
<input
  type="text"
  name="website"
  tabindex="-1"
  autocomplete="off"
  style="position:absolute;left:-5000px"
  x-model="formData.honeypot"
/>
```

Then in Apps Script, reject submissions if honeypot is filled:

```javascript
if (data.honeypot && data.honeypot !== '') {
  // Bot detected, reject submission
  return ContentService.createTextOutput(JSON.stringify({ success: false }));
}
```

---

## 📝 Sample Email Sequence (Manual for MVP)

After collecting leads, send these emails manually (copy/paste templates):

### Day 0: Lead Magnet Delivery
**Subject**: Votre Évaluation IA Gratuite - Vecia

Bonjour {Name},

Merci de votre intérêt pour l'automatisation IA !

Voici votre évaluation personnalisée : [LIEN VERS PDF]

À très bientôt,
L'équipe Vecia

---

### Day 3: Case Study
**Subject**: Comment {Company X} a économisé 8h/semaine

Bonjour {Name},

Voici comment une entreprise comme la vôtre a transformé ses opérations avec l'IA...

[LIEN VERS CASE STUDY]

Intéressé(e) par un échange ? Répondez à cet email.

---

### Day 7: Problem/Solution Article
**Subject**: 3 signes que votre entreprise a besoin d'automatisation

Bonjour {Name},

Voici un article qui pourrait vous intéresser...

[LIEN VERS BLOG]

---

### Day 14: Call Invitation
**Subject**: Prêt(e) à passer à l'action ?

Bonjour {Name},

Réservez 30 minutes avec nous pour discuter de vos besoins :

[LIEN CALENDLY]

---

## ✅ Setup Complete!

Your lead capture system is now live. Next steps:

1. ✅ Test the form on both French and English pages
2. ✅ Share test page with team for review
3. ✅ Integrate component into homepage
4. ✅ Set up email templates for manual follow-up
5. ✅ Track conversion rates in Google Sheets

---

**Questions?** Check the component code comments or consult:
- [Astro Forms Documentation](https://docs.astro.build/en/guides/backend/forms/)
- [Google Apps Script Docs](https://developers.google.com/apps-script)

**Last Updated**: 2025-10-07
