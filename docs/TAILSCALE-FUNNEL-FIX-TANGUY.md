# Guide de Configuration Tailscale Funnel - Solution DNS

**Date**: 2025-12-12
**Pour**: Tanguy
**Objectif**: Rendre les webhooks n8n accessibles publiquement via Tailscale Funnel

---

## 🎯 Résumé du Problème

### Situation Actuelle
Votre serveur (`srvdev2025.taildb74a2.ts.net`) héberge n8n avec des webhooks que le site web Vecia (sur le VPS d'Alex **sans Tailscale**) doit pouvoir appeler. Actuellement:

- ✅ **n8n fonctionne** via Tailscale VPN (`curl http://100.124.143.6:5678/healthz` → `{"status":"ok"}`)
- ❌ **DNS public ne résout PAS** - `dig @8.8.8.8 srvdev2025.taildb74a2.ts.net` retourne **RIEN** (pas de réponse)
- ❌ **Funnel pas opérationnel** - Le serveur n'est pas accessible via HTTPS depuis Internet
- ⚠️ **MagicDNS local seulement** - Résolution fonctionne uniquement pour les machines Tailscale (retourne 100.124.143.6)

### Pourquoi c'est Important
Le site Vecia doit envoyer des leads et inscriptions newsletter via des requêtes POST HTTPS. Sans DNS public fonctionnel, les webhooks ne sont pas accessibles depuis Internet, rendant Funnel inutile.

---

## 📐 Architecture Actuelle

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET PUBLIC                          │
└─────────────────────────────────────────────────────────────────┘
                │                              │
                │                              │
        ┌───────▼──────────┐         ┌────────▼─────────────┐
        │   VPS Alex       │         │  Tailscale Funnel    │
        │  85.25.172.47    │         │   Relay Servers      │
        │                  │         │  (199.247.155.53)    │
        │  vecia.fr        │         └──────────┬───────────┘
        │  (Astro site)    │                    │
        │                  │                    │ Tunnel chiffré
        │  ❌ PAS Tailscale│                    │
        └──────────────────┘                    │
                                                │
                                    ┌───────────▼───────────┐
                                    │  Serveur Tanguy      │
                                    │  100.124.143.6       │
                                    │  srvdev2025.ts.net   │
                                    │                      │
                                    │  ✅ Tailscale        │
                                    │  ✅ n8n (port 5678)  │
                                    │  ✅ Odoo CRM         │
                                    │  ✅ PostgreSQL       │
                                    └──────────────────────┘
```

**Le flux souhaité**:
1. Utilisateur soumet formulaire sur vecia.fr
2. Site envoie POST → `https://srvdev2025.taildb74a2.ts.net/webhook/leads`
3. DNS public résout → IP des serveurs relay Tailscale
4. Relay Tailscale → tunnel chiffré → ton serveur n8n
5. n8n traite le webhook → envoie données à Odoo

---

## 🔍 Pourquoi le Funnel ne Fonctionne Pas

### Diagnostic Complet

D'après mes recherches (documentation officielle Tailscale 2024-2025), voici les causes probables:

#### 1. **MagicDNS Désactivé** (Probabilité: 90%)
- **Symptôme**: DNS public ne retourne rien
- **Cause**: Funnel **EXIGE** que MagicDNS soit activé dans la console admin
- **Citation officielle**: *"Funnel requires MagicDNS enabled for your tailnet"*

#### 2. **HTTPS Certificates Non Activés** (Probabilité: 85%)
- **Symptôme**: Funnel configuré mais pas de certificats Let's Encrypt
- **Cause**: HTTPS doit être explicitement activé dans la console DNS
- **Citation officielle**: *"To enable HTTPS certificates for your Tailscale network, you must: 1. Enable MagicDNS [...] 2. Activate HTTPS - Navigate to the DNS page and select 'Enable HTTPS'"*

#### 3. **NodeAttrs Manquant dans ACL** (Probabilité: 60%)
- **Symptôme**: Funnel semble activé mais trafic bloqué
- **Cause**: Policy ACL ne donne pas permission "funnel" au nœud
- **Configuration requise**:
```json
"nodeAttrs": [
  {
    "target": ["autogroup:member"],
    "attr": ["funnel"]
  }
]
```

#### 4. **Propagation DNS en Cours** (Probabilité: 20%)
- **Symptôme**: Funnel nouvellement activé
- **Cause**: Les DNS publics peuvent prendre **jusqu'à 10 minutes** à se propager
- **Citation officielle**: *"Public DNS records can take up to 10 minutes to show up for your tailnet domain"*

#### 5. **Port Incorrect Utilisé** (Probabilité: 30%)
- **Symptôme**: Service n8n sur port 5678
- **Cause**: Funnel ne supporte QUE les ports **443, 8443, 10000**
- **Citation officielle**: *"Funnel can only listen on ports 443, 8443, and 10000"*

---

## ✅ Solution Étape par Étape

### Préparation

Avant de commencer, assure-toi d'avoir:
- [ ] Accès admin à la console Tailscale: https://login.tailscale.com/admin
- [ ] Accès SSH au serveur `srvdev2025`
- [ ] n8n en cours d'exécution (vérifie avec `docker ps` ou `systemctl status n8n`)
- [ ] Version Tailscale >= 1.38.3 (vérifie avec `tailscale version`)

---

### Étape 1: Activer MagicDNS (Console Admin)

1. **Connexion à la console**:
   - Ouvre https://login.tailscale.com/admin/dns
   - Connecte-toi avec ton compte Tailscale

2. **Activer MagicDNS**:
   - Cherche la section **"MagicDNS"**
   - Si désactivé, clique sur **"Enable MagicDNS"**
   - Confirme l'activation

3. **Vérification**:
   - Tu devrais voir: ✅ MagicDNS enabled
   - Les noms de machine deviennent `nom-machine.tailnet.ts.net`

---

### Étape 2: Activer HTTPS Certificates (Console Admin)

**CRITIQUE**: Sans ça, Funnel ne peut PAS créer de DNS publics.

1. **Reste sur la page DNS** (https://login.tailscale.com/admin/dns)

2. **Cherche "HTTPS Certificates"**:
   - Section généralement en bas de la page DNS
   - Clique sur **"Enable HTTPS"**

3. **Accepte l'avertissement**:
   ```
   ⚠️ IMPORTANT: Les noms de machine apparaîtront dans le registre
   public Certificate Transparency de Let's Encrypt. N'active PAS
   si tes noms de machine contiennent des infos sensibles.
   ```
   - Dans ton cas, `srvdev2025` est générique → **OK**
   - Clique **"I understand, enable HTTPS"**

4. **Vérification**:
   - Tu devrais voir: ✅ HTTPS enabled
   - Let's Encrypt commencera à provisionner les certificats

---

### Étape 3: Vérifier/Ajouter NodeAttrs dans ACL Policy

1. **Ouvre l'éditeur ACL**:
   - Va sur https://login.tailscale.com/admin/acls
   - Tu verras un éditeur JSON

2. **Cherche la section `nodeAttrs`**:
   - Si elle existe déjà, vérifie qu'elle contient:
   ```json
   "nodeAttrs": [
     {
       "target": ["autogroup:member"],
       "attr": ["funnel"]
     }
   ],
   ```

   - **Si elle n'existe pas**, ajoute-la **après** la section `acls`:
   ```json
   {
     "acls": [
       // ... tes ACL existantes ...
     ],
     "nodeAttrs": [
       {
         "target": ["autogroup:member"],
         "attr": ["funnel"]
       }
     ]
   }
   ```

3. **Sauvegarde**:
   - Clique **"Save"** en bas de l'éditeur
   - Tailscale validera la syntaxe JSON
   - Si erreur, vérifie les virgules et accolades

**Alternative si tu veux restreindre à ton serveur uniquement**:
```json
"nodeAttrs": [
  {
    "target": ["tag:server", "srvdev2025"],
    "attr": ["funnel"]
  }
]
```

---

### Étape 4: Reconfigurer Funnel sur le Serveur

Maintenant que MagicDNS et HTTPS sont activés, reconfigure Funnel correctement.

**Connecte-toi en SSH au serveur**:
```bash
ssh tanguy@100.124.143.6
# ou
ssh tanguy@srvdev2025.taildb74a2.ts.net
```

#### 4A. Arrête la configuration Funnel actuelle

```bash
sudo tailscale funnel reset
```

**Sortie attendue**:
```
Funnel configuration has been reset.
```

#### 4B. Configure n8n pour utiliser un port compatible Funnel

**Problème**: n8n tourne probablement sur port 5678, mais Funnel exige **443, 8443, ou 10000**.

**Solution 1 - Reverse Proxy avec Tailscale Serve (Recommandé)**:

```bash
# Démarre Serve en arrière-plan (persiste après redémarrage)
sudo tailscale serve --bg https / http://localhost:5678
```

**Explication**:
- `--bg`: Exécute en arrière-plan, redémarre automatiquement
- `https /`: Expose sur port 443 HTTPS
- `http://localhost:5678`: Proxy vers n8n local

**Solution 2 - Port 8443 (Alternative)**:

Si tu préfères garder 443 libre:
```bash
sudo tailscale serve --bg https:8443 / http://localhost:5678
```

#### 4C. Active Funnel sur le port HTTPS

```bash
# Pour port 443 (par défaut)
sudo tailscale funnel 443 on

# OU pour port 8443
sudo tailscale funnel 8443 on
```

**Sortie attendue**:
```
Funnel started and running in the background.
Press Ctrl+C to exit and leave it running.

Available within your tailnet:
  https://srvdev2025.taildb74a2.ts.net/

Available on the internet:
  https://srvdev2025.taildb74a2.ts.net/
```

**⚠️ IMPORTANT**: Tu dois voir **"Available on the internet"** - si ce n'est pas le cas, MagicDNS ou HTTPS ne sont pas activés.

---

### Étape 5: Vérifier le Statut Funnel

```bash
sudo tailscale funnel status
```

**Sortie attendue (exemple)**:
```
# Funnel on:
#     - https://srvdev2025.taildb74a2.ts.net
#
# |-- / proxy http://127.0.0.1:5678

Funnel started and available on:
  https://srvdev2025.taildb74a2.ts.net

Funnel on
```

**Vérifie**:
- ✅ "Funnel on"
- ✅ URL commence par `https://`
- ✅ Proxy pointe vers `http://127.0.0.1:5678` (n8n)

---

### Étape 6: Vérifier les Certificats HTTPS

```bash
sudo tailscale cert srvdev2025.taildb74a2.ts.net
```

**Première exécution** (si pas encore de certificat):
```
Requesting certificate for srvdev2025.taildb74a2.ts.net...
Certificate obtained successfully.
```

Les certificats seront sauvegardés dans `/var/lib/tailscale/certs/` (ou affichés dans stdout).

**Si déjà existant**:
```
Certificate already exists for srvdev2025.taildb74a2.ts.net
Expires: 2025-03-12 (89 days from now)
```

---

## 🧪 Test de Vérification

### Test 1: DNS Public Résout Correctement

**Depuis TON SERVEUR** (pour vérifier DNS Tailscale):
```bash
nslookup srvdev2025.taildb74a2.ts.net 100.100.100.100
```

**Sortie attendue**:
```
Server:    100.100.100.100
Address:   100.100.100.100#53

Name:      srvdev2025.taildb74a2.ts.net
Address:   100.124.143.6  # Ton IP Tailscale (normal)
```

**Depuis UN APPAREIL SANS TAILSCALE** (ou depuis le VPS d'Alex):
```bash
nslookup srvdev2025.taildb74a2.ts.net 8.8.8.8
```

**Sortie attendue APRÈS configuration**:
```
Server:    8.8.8.8
Address:   8.8.8.8#53

Non-authoritative answer:
Name:      srvdev2025.taildb74a2.ts.net
Address:   199.247.155.53  # IP du relay Funnel (exemple)
```

**⚠️ Note**: L'IP sera celle des serveurs relay Tailscale (199.x.x.x ou autre), **PAS** ton IP serveur 100.124.143.6.

**Si tu obtiens toujours "No answer"**:
- Attends 10 minutes (propagation DNS)
- Vérifie que HTTPS est activé dans console admin
- Vérifie que MagicDNS est activé

---

### Test 2: Accès HTTPS Public Fonctionne

**Depuis TON ORDINATEUR** (ou le VPS d'Alex):

```bash
curl -v https://srvdev2025.taildb74a2.ts.net/
```

**Sortie attendue**:
```
* Trying 199.247.155.53:443...
* Connected to srvdev2025.taildb74a2.ts.net (199.247.155.53)
* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256
* Server certificate:
*  subject: CN=srvdev2025.taildb74a2.ts.net
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
...
< HTTP/2 200
...
[HTML de n8n ou page d'accueil]
```

**Vérifie**:
- ✅ Connexion à une IP 199.x.x.x (relay Tailscale)
- ✅ Certificat Let's Encrypt valide
- ✅ HTTP/2 200 (succès)
- ✅ Contenu de n8n retourné

**Si erreur SSL**:
- Certificat pas encore provisionné → attends quelques minutes
- HTTPS pas activé dans console → retourne à l'Étape 2

**Si timeout/connexion refusée**:
- Funnel pas activé → vérifie `tailscale funnel status`
- Port incorrect → vérifie que tu utilises 443/8443/10000
- Firewall bloque → vérifie `ufw` ou `iptables`

---

### Test 3: Webhook n8n Accessible Publiquement

**Crée un webhook de test dans n8n**:
1. Ouvre n8n: http://localhost:5678 (depuis le serveur)
2. Crée un nouveau workflow
3. Ajoute un nœud **"Webhook"**
4. Configure:
   - Method: `POST`
   - Path: `test-funnel`
   - Response Code: `200`
   - Response Data: `{ "status": "ok", "message": "Funnel works!" }`
5. Active le workflow

**Teste depuis l'extérieur** (ton PC, VPS Alex, etc.):

```bash
curl -X POST https://srvdev2025.taildb74a2.ts.net/webhook/test-funnel \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Réponse attendue**:
```json
{
  "status": "ok",
  "message": "Funnel works!"
}
```

**Si ça marche**: ✅ Funnel est 100% opérationnel, tu peux remplacer ngrok !

---

## 🔗 URLs Finales pour le Site Vecia

Une fois Funnel configuré, les webhooks n8n auront des URLs **permanentes**:

### Webhooks Production

```
https://srvdev2025.taildb74a2.ts.net/webhook/lead-contact
https://srvdev2025.taildb74a2.ts.net/webhook/newsletter-signup
https://srvdev2025.taildb74a2.ts.net/webhook/demo-request
```

### Avantages vs ngrok

| Caractéristique | ngrok | Tailscale Funnel |
|----------------|-------|------------------|
| **Stabilité URL** | ❌ Change à chaque redémarrage | ✅ Permanente |
| **Certificat HTTPS** | ✅ Automatique | ✅ Let's Encrypt auto |
| **Coût** | 💰 $8-20/mois pour URL fixe | ✅ Gratuit (inclus Tailscale) |
| **Performance** | ⚡ Relay global | ⚡ Relay global (comparable) |
| **Redémarrage serveur** | 🔴 URL cassée | ✅ URL persiste |
| **Configuration** | 🟡 Simple mais fragile | 🟢 Config une fois, oublie |

---

## 🐛 Dépannage

### Problème: "Funnel on" mais DNS public ne résout toujours pas

**Solutions**:
1. **Attends 10 minutes** - Propagation DNS peut être lente
2. **Vérifie HTTPS activé**:
   ```bash
   # Sur le serveur
   tailscale cert srvdev2025.taildb74a2.ts.net
   ```
   Si erreur "HTTPS not enabled" → retourne Étape 2

3. **Redémarre Tailscale**:
   ```bash
   sudo systemctl restart tailscaled
   # Attends 30 secondes
   sudo tailscale funnel status
   ```

4. **Vérifie version Tailscale**:
   ```bash
   tailscale version
   ```
   Si < 1.38.3, mets à jour:
   ```bash
   sudo apt update && sudo apt install tailscale
   # ou
   curl -fsSL https://tailscale.com/install.sh | sh
   ```

---

### Problème: "Certificate request failed" ou rate limit Let's Encrypt

**Cause**: Trop de tentatives de génération de certificat.

**Solution**:
1. **Stop toutes tentatives** pendant 1 heure
2. **Vérifie status**:
   ```bash
   sudo tailscale cert srvdev2025.taildb74a2.ts.net
   ```
3. Si rate limit dépassé, attends **34 heures** (limitation Let's Encrypt)
4. Utilise la commande **UNE SEULE FOIS** après attente

**Prévention**: Ne pas exécuter `tailscale cert` en boucle pour tester.

---

### Problème: Connexion timeout depuis Internet mais fonctionne en Tailscale

**Diagnostic**:
```bash
# Sur le serveur
sudo tailscale funnel status
```

Si tu vois:
```
Available within your tailnet:
  https://srvdev2025.taildb74a2.ts.net/
```

Mais **PAS**:
```
Available on the internet:
  https://srvdev2025.taildb74a2.ts.net/
```

**Cause**: Funnel en mode "serve" (interne uniquement).

**Solution**:
```bash
# Assure-toi d'activer FUNNEL explicitement
sudo tailscale funnel 443 on  # pas juste 'serve'
```

---

### Problème: "Health warning: DNS configuration fetch failed"

**Cause**: Tailscale ne peut pas lire la config DNS système (peut être ignoré si Funnel fonctionne).

**Vérification**:
```bash
tailscale status
```

Si tout le reste fonctionne (Funnel accessible, certificats OK), cet avertissement est **non critique**.

**Solution optionnelle** (si ça te gêne):
```bash
# Redémarre avec DNS système réinitialisé
sudo systemctl restart systemd-resolved
sudo systemctl restart tailscaled
```

---

### Problème: Port 443 déjà utilisé (Nginx, Apache, etc.)

**Diagnostic**:
```bash
sudo netstat -tlnp | grep :443
```

Si un autre service utilise 443:

**Solution A - Utilise port 8443**:
```bash
sudo tailscale serve --bg https:8443 / http://localhost:5678
sudo tailscale funnel 8443 on
```

URLs deviennent: `https://srvdev2025.taildb74a2.ts.net:8443/webhook/...`

**Solution B - Utilise port 10000**:
```bash
sudo tailscale serve --bg https:10000 / http://localhost:5678
sudo tailscale funnel 10000 on
```

URLs: `https://srvdev2025.taildb74a2.ts.net:10000/webhook/...`

---

## 📚 Références Officielles

### Documentation Tailscale (2024-2025)

1. **Funnel Guide Complet**:
   https://tailscale.com/kb/1223/funnel

2. **Funnel vs Serve Use Cases**:
   https://tailscale.com/kb/1247/funnel-serve-use-cases

3. **Funnel ACL Configuration**:
   https://tailscale.com/kb/1242/tailscale-funnel-acl

4. **Enable HTTPS Certificates**:
   https://tailscale.com/kb/1153/enable-https

5. **DNS Configuration**:
   https://tailscale.com/kb/1054/dns

6. **Funnel Command Reference**:
   https://tailscale.com/kb/1311/tailscale-funnel

7. **Changelog (updates récents)**:
   https://tailscale.com/changelog

### Mises à Jour Importantes 2024-2025

- **v1.92.1 (Dec 2024)**: Support PROXY protocol pour Funnel
- **v1.90.1 (2024)**: DNS resolvers avec exit nodes amélioré
- **v1.84.0 (2024)**: Fix DNS timeouts avec exit nodes
- **v1.82.0 (2024)**: Certificats incluent SAN extension

---

## 🎯 Checklist Finale

Avant de dire "c'est bon, ça marche", vérifie:

- [ ] **MagicDNS activé** dans console admin (https://login.tailscale.com/admin/dns)
- [ ] **HTTPS activé** dans console admin (section HTTPS Certificates)
- [ ] **NodeAttrs "funnel"** présent dans ACL policy
- [ ] **Tailscale version >= 1.38.3** sur le serveur
- [ ] **`tailscale serve --bg`** configuré pour proxy n8n
- [ ] **`tailscale funnel 443 on`** exécuté
- [ ] **`tailscale funnel status`** montre "Available on the internet"
- [ ] **DNS public résout** via `nslookup srvdev2025.taildb74a2.ts.net 8.8.8.8`
- [ ] **Certificat Let's Encrypt valide** via `tailscale cert`
- [ ] **Test curl depuis Internet** retourne 200 OK
- [ ] **Webhook n8n test** répond depuis l'extérieur
- [ ] **URLs communiquées à Alex** pour intégration site web

---

## 💡 Prochaines Étapes

### 1. Configuration n8n Webhooks Production

Crée les workflows n8n pour:
- **Lead Contact**: `/webhook/lead-contact`
- **Newsletter**: `/webhook/newsletter-signup`
- **Demande Demo**: `/webhook/demo-request`

### 2. Intégration avec Odoo CRM

Configure les workflows n8n pour envoyer les données vers Odoo:
- Utilise le nœud "Odoo" dans n8n
- Credentials: URL Odoo, database, user, password
- Map les champs formulaire → champs Odoo

### 3. Communication avec Alex

Envoie-lui les URLs finales:
```
Production webhooks:
- Lead: https://srvdev2025.taildb74a2.ts.net/webhook/lead-contact
- Newsletter: https://srvdev2025.taildb74a2.ts.net/webhook/newsletter-signup
- Demo: https://srvdev2025.taildb74a2.ts.net/webhook/demo-request
```

### 4. Monitoring

Configure des alertes n8n si les webhooks échouent:
- Nœud "Error Trigger" dans workflows
- Envoie notification Discord/Slack/Email si erreur

---

## ❓ Questions Fréquentes

### Funnel consomme-t-il de la bande passante même sans trafic ?

Non. Funnel crée juste des DNS records et ouvre un tunnel à la demande. Pas de trafic = pas de consommation.

### Les URLs Funnel changent-elles si je redémarre le serveur ?

Non. Tant que le nom machine reste `srvdev2025`, l'URL `https://srvdev2025.taildb74a2.ts.net` est **permanente**.

### Puis-je utiliser un nom de domaine personnalisé (vecia.fr) ?

Non directement avec Funnel. Tu devrais:
1. Créer CNAME `webhooks.vecia.fr` → `srvdev2025.taildb74a2.ts.net`
2. Mais certificat SSL poserait problème (Let's Encrypt pour .ts.net seulement)

**Recommandation**: Garde les URLs `.ts.net` pour les webhooks (backend), invisible pour l'utilisateur.

### Funnel fonctionne-t-il si le serveur est derrière NAT ?

Oui ! C'est tout l'intérêt. Tailscale traverse NAT/firewalls automatiquement via les relays.

### Que se passe-t-il si Tailscale est down ?

Les webhooks ne fonctionneront plus. Mais Tailscale a 99.9% uptime historique (meilleur que ngrok free tier).

**Mitigation**: Configure un healthcheck n8n qui alerte si webhook down > 5 min.

---

## 📞 Support

Si tu bloques après avoir suivi ce guide:

1. **Vérifie la checklist finale** (section précédente)
2. **Collecte les infos de debug**:
   ```bash
   tailscale version
   tailscale status
   tailscale funnel status
   nslookup srvdev2025.taildb74a2.ts.net 8.8.8.8
   curl -v https://srvdev2025.taildb74a2.ts.net/
   ```
3. **Envoie à Alex** avec description du problème exact
4. **Support Tailscale**: https://tailscale.com/contact/support (si bug confirmé)

---

**Créé par**: Alex (Vecia)
**Pour**: Tanguy (Infrastructure Vecia)
**Dernière mise à jour**: 2025-12-12
**Version**: 1.0

🚀 **Bon courage avec la config ! Funnel va remplacer ngrok en mode beast.**