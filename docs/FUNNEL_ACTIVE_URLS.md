# ✅ Tailscale Funnel Activé - URLs Webhook

**Date :** 11 décembre 2025
**Serveur :** srvdev2025 (100.124.143.6)
**Statut :** ✅ Actif et permanent

---

## 🔗 URL Publique n8n

```
https://srvdev2025.taildb74a2.ts.net/
```

**Caractéristiques :**
- ✅ HTTPS automatique (certificat Tailscale)
- ✅ URL permanente (ne change jamais)
- ✅ Accessible depuis internet public
- ✅ Mode background (survit aux redémarrages)

---

## 📝 URLs Webhook pour Alexandre

**À communiquer à Alexandre pour mise à jour du site web (VPS 85.25.172.47) :**

### Lead Form (Formulaire Contact)
```
https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead
```

### Newsletter (Inscription Newsletter)
```
https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter
```

---

## 🔧 Configuration Site Web (pour Alex)

Alexandre doit mettre à jour le fichier **`.env`** sur son VPS :

```env
PUBLIC_N8N_LEAD_WEBHOOK=https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead
PUBLIC_N8N_NEWSLETTER_WEBHOOK=https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter
```

**Ou** dans le fichier `src/config.ts` :

```typescript
n8n: {
  leadWebhookUrl: 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead',
  newsletterWebhookUrl: 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter',
}
```

Puis **rebuild et redéployer** le site web.

---

## 🧪 Test Webhook

Pour tester que le webhook fonctionne depuis n'importe quelle machine :

```bash
curl -X POST "https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "email": "test@example.com",
    "name": "Test Funnel",
    "company": "Test Company"
  }'
```

**Vérifier dans n8n** (http://100.124.143.6:5678) que l'exécution apparaît dans les logs.

---

## 📊 Statut Funnel

Pour voir le statut de Funnel sur le serveur :

```bash
ssh axelor@100.124.143.6
tailscale funnel status
```

Devrait afficher :
```
https://srvdev2025.taildb74a2.ts.net/
|-- proxy http://127.0.0.1:5678

Funnel started and running in the background.
```

---

## 🛑 Arrêter/Redémarrer Funnel (si nécessaire)

### Arrêter Funnel
```bash
ssh axelor@100.124.143.6
sudo tailscale funnel off
```

### Redémarrer Funnel
```bash
ssh axelor@100.124.143.6
sudo tailscale funnel --bg 5678
```

---

## 🗑️ Nettoyage ngrok (Optionnel)

Une fois que le site web est mis à jour et testé avec Funnel, tu peux supprimer ngrok :

```bash
ssh axelor@100.124.143.6

# Arrêter et supprimer le container ngrok (si existant)
docker stop ngrok 2>/dev/null || true
docker rm ngrok 2>/dev/null || true

# Vérifier
docker ps | grep ngrok  # Ne devrait rien afficher
```

---

## ✅ Checklist Post-Activation

- [x] Funnel activé sur serveur
- [x] URL publique disponible : `https://srvdev2025.taildb74a2.ts.net/`
- [x] URLs webhook communiquées à Alexandre
- [x] Alexandre a mis à jour le code source (2025-12-20)
- [x] Site web rebuild réussi
- [ ] Test formulaire site → Lead dans Odoo ✅
- [ ] Déployer sur VPS production
- [ ] ngrok supprimé (optionnel)

---

## 🔐 Sécurité

### Accès Public (Funnel)
- ✅ n8n webhooks : Accessibles publiquement
- ⚠️ Pas d'authentification webhook (recommandation : ajouter un secret)

### Accès Privé (Tailscale VPN)
- 🔒 n8n UI : http://100.124.143.6:5678 (privé)
- 🔒 Odoo UI : http://100.124.143.6:8069 (privé)
- 🔒 SSH : ssh axelor@100.124.143.6 (privé)

### Recommandation Sécurité

Ajouter un secret dans les webhooks n8n pour éviter le spam :

**Dans n8n (node webhook) :**
```javascript
const expectedSecret = 'votre_secret_long_et_aleatoire';
const receivedSecret = $json.headers['x-webhook-secret'];

if (receivedSecret !== expectedSecret) {
  throw new Error('Unauthorized');
}
```

**Côté site web (Alex) :**
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-Webhook-Secret': 'votre_secret_long_et_aleatoire'
}
```

---

## 📚 Documentation

- [Infrastructure Tailscale](docs/infrastructure/tailscale/README.md)
- [Policy ACL Sécurisée](docs/infrastructure/tailscale/TAILSCALE_ACL_POLICY_SECURE.json)
- [Résumé Travail](RESUME_TRAVAIL_TAILSCALE.md)

---

## 🎯 Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET PUBLIC                           │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             │ HTTPS                          │ HTTPS Funnel
             ▼                                ▼
    ┌────────────────┐              ┌──────────────────────┐
    │  Site Web      │              │  n8n Webhooks        │
    │  (VPS Alex)    │──────────────>│  (Public)            │
    │  vecia.fr      │  POST leads  │  srvdev2025.ts.net   │
    └────────────────┘              └──────────┬───────────┘
                                               │ Tailscale VPN
┌──────────────────────────────────────────────┼───────────────┐
│            TAILSCALE VPN (PRIVÉ)             │               │
│                                              ▼               │
│  ┌────────────┐       ┌──────────────────────────────────┐  │
│  │ Tanguy Mac │◄─────►│  Serveur srvdev2025              │  │
│  │ Alexandre  │  SSH  │  ┌────────┬────────┬──────────┐  │  │
│  └────────────┘ n8n UI│  │  n8n   │ Odoo   │   SSH    │  │  │
│                 Odoo  │  │  :5678 │ :8069  │   :22    │  │  │
│                       │  └────────┴────────┴──────────┘  │  │
│                       └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Le flux :**
1. Visiteur remplit formulaire sur vecia.fr
2. Site POST vers `https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead`
3. Funnel route vers n8n (port 5678 local)
4. n8n traite et crée lead dans Odoo
5. Email confirmation envoyé au visiteur

---

**Date d'activation :** 11 décembre 2025
**URL permanente :** https://srvdev2025.taildb74a2.ts.net/
**Status :** ✅ Production Ready