# Mise à Jour Webhooks n8n - Pour Alexandre

**Date :** 11 décembre 2025
**Priorité :** Moyenne (amélioration infrastructure)
**Temps estimé :** 10-15 minutes

---

## 📋 Contexte

Les webhooks n8n utilisent actuellement **ngrok** avec une URL temporaire qui change à chaque redémarrage.

On passe maintenant à **Tailscale Funnel** qui fournit une **URL permanente** :
- ✅ Ne change jamais
- ✅ Pas de redémarrage nécessaire
- ✅ Plus fiable pour la production
- ✅ HTTPS automatique

---

## 🔗 Nouvelles URLs Webhook

### Lead Form (Formulaire Contact)
```
https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead
```

### Newsletter (Inscription Newsletter)
```
https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter
```

**⚠️ IMPORTANT :** Ces URLs sont **permanentes**. Une fois configurées, tu n'auras plus jamais à les changer.

---

## 🔧 Mise à Jour du Site Web

### Option 1 : Via fichier `.env` (Recommandé)

Sur ton VPS (85.25.172.47), édite le fichier `.env` :

```bash
# Se connecter au VPS
ssh ton-vps

# Éditer le .env du site
nano /chemin/vers/site/.env
# ou
vim /chemin/vers/site/.env
```

**Modifier ces lignes :**

```env
# AVANT (ngrok - à remplacer)
PUBLIC_N8N_LEAD_WEBHOOK=https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-lead
PUBLIC_N8N_NEWSLETTER_WEBHOOK=https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-newsletter

# APRÈS (Tailscale Funnel - permanent)
PUBLIC_N8N_LEAD_WEBHOOK=https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead
PUBLIC_N8N_NEWSLETTER_WEBHOOK=https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter
```

**Sauvegarder** (Ctrl+X puis Y pour nano, :wq pour vim)

### Option 2 : Via fichier de configuration TypeScript

Si le site utilise un fichier `config.ts` ou similaire :

```typescript
// src/config.ts (ou équivalent)
export const config = {
  n8n: {
    // AVANT
    // leadWebhookUrl: 'https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-lead',
    // newsletterWebhookUrl: 'https://christel-brachystomatous-mertie.ngrok-free.dev/webhook/vecia-newsletter',

    // APRÈS
    leadWebhookUrl: 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead',
    newsletterWebhookUrl: 'https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter',
  },
  // ... reste de la config
};
```

---

## 🚀 Rebuild et Déploiement

Après modification, rebuild et redéploie le site :

```bash
# Si c'est un projet Node.js/Next.js/SvelteKit
npm run build
npm run deploy
# ou
pm2 restart site-vecia

# Si c'est avec Docker
docker-compose down
docker-compose up -d --build

# Si c'est avec systemd
sudo systemctl restart vecia-site
```

**Adapter selon ton setup de déploiement.**

---

## 🧪 Tester que ça Fonctionne

### Test 1 : Webhook Direct (depuis ton terminal)

```bash
# Test webhook Lead Form
curl -X POST "https://srvdev2025.taildb74a2.ts.net/webhook/vecia-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "email": "alexandre.test@example.com",
    "name": "Alex Test",
    "company": "Test Company"
  }'

# Test webhook Newsletter
curl -X POST "https://srvdev2025.taildb74a2.ts.net/webhook/vecia-newsletter" \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "email": "newsletter.test@example.com"
  }'
```

**Résultat attendu :**
- Le webhook répond (code HTTP 200 ou similaire)
- Un nouveau lead apparaît dans Odoo CRM

### Test 2 : Via le Site Web (Test End-to-End)

1. Aller sur **vecia.fr**
2. Remplir un **formulaire de contact** avec des données de test
3. Vérifier qu'un **email de confirmation** est reçu
4. Vérifier dans **Odoo** que le lead est créé

**Si tout fonctionne :** ✅ La migration est réussie !

---

## 📊 Comparaison Avant/Après

| Aspect | Avant (ngrok) | Après (Tailscale Funnel) |
|--------|---------------|--------------------------|
| **URL** | Temporaire (change) | Permanente (jamais) |
| **Maintenance** | Redémarrage manuel | Automatique |
| **Fiabilité** | Moyenne (sessions) | Haute (toujours on) |
| **HTTPS** | Oui | Oui |
| **Configuration** | À refaire régulièrement | Une seule fois |

---

## 🗑️ Nettoyage (Optionnel)

Une fois que tout fonctionne avec Funnel, tu peux :

1. **Supprimer les anciennes références ngrok** dans ton code (commentées ou supprimées)
2. **Informer Tanguy** que tout est OK de ton côté

Tanguy pourra alors supprimer ngrok du serveur n8n.

---

## ❓ FAQ

### Les webhooks vont-ils changer à l'avenir ?

**Non.** Ces URLs Tailscale Funnel sont **permanentes**. Contrairement à ngrok, elles ne changeront jamais.

### Dois-je faire quelque chose si le serveur n8n redémarre ?

**Non.** Funnel est configuré en mode background permanent. Il redémarre automatiquement.

### Que se passe-t-il si le site ne peut pas joindre le webhook ?

Le site devrait afficher une erreur à l'utilisateur. Vérifie :
1. Que l'URL est correcte (pas de typo)
2. Que le serveur n8n est bien démarré (contacte Tanguy)
3. Les logs du site web pour plus de détails

### J'ai une erreur CORS

Normalement, il ne devrait pas y avoir d'erreur CORS car les webhooks sont appelés **côté serveur** (pas depuis le navigateur).

Si tu as une erreur CORS, c'est que le webhook est appelé côté client. Il faut le déplacer côté serveur (API route).

### Comment savoir si le webhook a bien été reçu ?

**Option 1 :** Regarder les logs du site web
**Option 2 :** Demander à Tanguy de vérifier dans n8n UI
**Option 3 :** Vérifier qu'un lead apparaît dans Odoo CRM

---

## 🆘 Support

**Si tu rencontres un problème :**

1. **Vérifie les logs du site web** - L'erreur y sera probablement mentionnée
2. **Teste le webhook directement** avec curl (voir section "Test 1" ci-dessus)
3. **Contacte Tanguy** - Il peut vérifier côté n8n/Odoo

**Informations utiles à donner à Tanguy en cas de problème :**
- Message d'erreur exact
- Code HTTP reçu (si disponible)
- Logs du site web
- Timestamp approximatif du test

---

## ✅ Checklist Déploiement

Avant de déployer en production :

- [ ] `.env` mis à jour avec nouvelles URLs
- [ ] Site rebuild
- [ ] Site redéployé
- [ ] Test curl réussi (webhook direct)
- [ ] Test formulaire site réussi (end-to-end)
- [ ] Lead de test visible dans Odoo
- [ ] Email de confirmation reçu
- [ ] Tanguy informé que c'est OK

Une fois tous ces points validés, la migration est complète ! 🎉

---

## 📞 Contact

**Pour questions techniques sur les webhooks :**
→ Tanguy (serveur n8n/Odoo)

**Pour questions sur le site web :**
→ Toi (VPS site web)

---

**Merci et bon déploiement ! 🚀**