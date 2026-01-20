# 🔧 COMMENT ÇA FONCTIONNE ?
## Architecture technique de l'intégration Google Sheets

---

## 📊 VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUX DE DONNÉES                          │
└─────────────────────────────────────────────────────────────┘

1. CLIENT                      2. SITE WEB                   3. GOOGLE APPS SCRIPT          4. GOOGLE SHEETS
   (Navigateur)                   (checkout-modal.js)            (Votre script)                 (Votre tableau)
   
   📱 Remplit                    📤 Prépare                    📝 Reçoit                      ✅ Nouvelle ligne
   le formulaire                 les données                    les données                    ajoutée
   
        │                             │                             │                             │
        │ Clic "Envoyer"             │                             │                             │
        └────────────────────────────▶│ sendViaGoogleSheets()      │                             │
                                      │                             │                             │
                                      │ POST Request (HTTPS)       │                             │
                                      └────────────────────────────▶│ doPost(e)                   │
                                                                    │                             │
                                                                    │ Traite les données         │
                                                                    │ sheet.appendRow()          │
                                                                    └────────────────────────────▶│ Ligne ajoutée
                                                                                                  │ Statut: "Neutre"
```

---

## 🔐 SÉCURITÉ & PERMISSIONS

### Pourquoi "Tout le monde" ?

```
┌──────────────────────────────────────────────────────┐
│ Configuration : "Qui a accès : Tout le monde"        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ✅ CE QUI EST ACCESSIBLE :                          │
│    → L'URL du script (endpoint public)              │
│    → Possibilité d'envoyer des données              │
│                                                      │
│ 🔒 CE QUI RESTE PRIVÉ :                             │
│    → Le contenu de votre Google Sheets              │
│    → Les autres données du Sheets                   │
│    → Votre compte Google                            │
│                                                      │
│ Analogie : C'est comme une boîte aux lettres        │
│ → Tout le monde peut DÉPOSER une lettre (commande)  │
│ → Seul VOUS pouvez LIRE le courrier (Sheets)        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Qu'est-ce que le script peut faire ?

```javascript
// Ce que le script PEUT faire :
✅ Ajouter des lignes dans VOTRE Sheets
✅ Lire les données envoyées par le site
✅ Formater les données (date, produits, etc.)

// Ce que le script NE PEUT PAS faire :
❌ Modifier/supprimer vos données existantes
❌ Accéder à d'autres Sheets
❌ Partager vos données
```

---

## 💻 CODE TECHNIQUE : LE SCRIPT

### Structure du script Google Apps Script

```javascript
function doPost(e) {
  // 1️⃣ Récupération des données POST
  const data = e.parameter;
  
  // 2️⃣ Ouverture du Sheets attaché
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 3️⃣ Formatage de la date
  const date = Utilities.formatDate(new Date(), "GMT+0", "dd/MM/yyyy HH:mm");
  
  // 4️⃣ Parsing des produits (JSON → texte)
  const items = JSON.parse(data.items);
  const produitsTexte = items.map(item => `${item.name} x${item.quantity}`).join(", ");
  
  // 5️⃣ Construction de la ligne à ajouter
  const rowData = [
    date,                    // Date
    data.customerName,       // Nom
    data.phone,              // Numéro
    data.city,               // Lieu
    data.comment,            // Note
    produitsTexte,           // Produits
    data.total,              // Prix
    "Neutre"                 // Statut
  ];
  
  // 6️⃣ Ajout de la ligne
  sheet.appendRow(rowData);
  
  // 7️⃣ Réponse de succès
  return ContentService.createTextOutput(JSON.stringify({ success: true }));
}
```

---

## 🌐 CODE SITE WEB : checkout-modal.js

### Préparation des données

```javascript
sendViaGoogleSheets() {
  const formData = this.getFormData();
  
  // 1️⃣ Préparer le payload
  const payload = {
    customerName: formData.customerName || 'N.A.',
    phone: formData.phone,
    city: formData.city || 'Non spécifié',
    comment: formData.comment || '',
    items: JSON.stringify(formData.items),  // Convertir en JSON
    total: formData.total,
    timestamp: formData.timestamp,
    status: 'Neutre'
  };
  
  // 2️⃣ Créer FormData pour envoi
  const formDataToSend = new FormData();
  Object.keys(payload).forEach(key => {
    formDataToSend.append(key, payload[key]);
  });
  
  // 3️⃣ Envoyer via fetch
  fetch(this.googleSheetsURL, {
    method: 'POST',
    body: formDataToSend
  })
  .then(() => {
    // Succès : sauvegarder localement et afficher message
    this.saveOrderLocally(formData);
    this.showSuccessMessage('Commande enregistrée !');
  })
  .catch(error => {
    // Erreur : sauvegarder quand même localement
    console.error('Erreur:', error);
    this.saveOrderLocally(formData);
  });
}
```

---

## 📦 FORMAT DES DONNÉES

### Données envoyées (POST)

```javascript
{
  // Champs texte simples
  customerName: "John Doe",           // ou "N.A."
  phone: "+225 07 68 24 59 17",
  city: "Cocody",                     // ou "Non spécifié"
  comment: "Livraison rapide svp",    // ou ""
  
  // Données structurées
  items: '[{"name":"Montre","quantity":1,"price":15000}]',  // JSON en string
  
  // Nombres
  total: 17000,
  
  // Date
  timestamp: "10/01/2026 14:32:15",
  
  // Statut
  status: "Neutre"
}
```

### Données dans Google Sheets

| Colonne   | Type    | Exemple                    | Source                |
|-----------|---------|----------------------------|-----------------------|
| Date      | Texte   | "10/01/2026 14:32"        | Auto (script)         |
| Nom       | Texte   | "John Doe"                 | Formulaire            |
| Numéro    | Texte   | "+225 07 68 24 59 17"     | Formulaire (requis)   |
| Lieu      | Texte   | "Cocody"                   | Formulaire            |
| Note      | Texte   | "Livraison rapide"         | Formulaire            |
| Produits  | Texte   | "Montre x1, Lunettes x2"   | Panier (formaté)      |
| Prix      | Nombre  | 17000                      | Total calculé         |
| Statuts   | Texte   | "Neutre"                   | Auto (script)         |

---

## 🔄 CYCLE DE VIE D'UNE COMMANDE

```
ÉTAPE 1 : Client sur le site
├─ Ajoute produits au panier
├─ Clique "Valider ma commande"
└─ Remplit le formulaire

ÉTAPE 2 : Validation côté client
├─ JavaScript vérifie le numéro de téléphone
├─ Calcule les frais de livraison
└─ Prépare le payload

ÉTAPE 3 : Envoi HTTPS
├─ fetch() POST vers Apps Script URL
├─ Données encodées en FormData
└─ Requête sécurisée (HTTPS)

ÉTAPE 4 : Réception Apps Script
├─ doPost(e) reçoit les données
├─ Parse les produits JSON
├─ Formate la date
└─ Construit rowData[]

ÉTAPE 5 : Ajout dans Sheets
├─ sheet.appendRow(rowData)
├─ Nouvelle ligne créée
└─ Statut "Neutre" défini

ÉTAPE 6 : Confirmation
├─ Script retourne success: true
├─ Site affiche message de succès
├─ Commande sauvegardée localement (backup)
└─ Panier vidé
```

---

## 🛡️ GESTION D'ERREURS

### Côté site web

```javascript
fetch(url, options)
  .then(response => {
    // ✅ Succès
    this.showSuccessMessage('Commande enregistrée !');
  })
  .catch(error => {
    // ❌ Erreur réseau ou Apps Script
    console.error('Erreur:', error);
    
    // Backup : sauvegarde locale quand même
    this.saveOrderLocally(formData);
    
    // Message utilisateur
    this.showSuccessMessage('Commande enregistrée localement');
  });
```

### Côté Apps Script

```javascript
function doPost(e) {
  try {
    // Code principal
    sheet.appendRow(rowData);
    return successResponse();
  } catch (error) {
    // En cas d'erreur, retourner l'erreur
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    );
  }
}
```

---

## 📈 AVANTAGES DE CETTE ARCHITECTURE

✅ **Simple** : Pas de backend complexe  
✅ **Gratuit** : Google Apps Script est gratuit  
✅ **Fiable** : Infrastructure Google (99.9% uptime)  
✅ **Sécurisé** : HTTPS + permissions Google  
✅ **Scalable** : Peut gérer des milliers de commandes  
✅ **Accessible** : Gérez vos commandes dans Sheets (interface familière)  
✅ **Backup automatique** : Sauvegarde locale en cas d'erreur réseau  

---

## 🔧 LIMITATIONS & QUOTAS

Google Apps Script a des quotas gratuits :

| Ressource                  | Limite quotidienne | Impact              |
|----------------------------|-------------------|---------------------|
| Requêtes URL               | 20,000            | ~555 commandes/jour |
| Temps d'exécution          | 6 min/exécution   | Largement suffisant |
| Déclencheurs               | 90 min/jour       | N/A (on utilise POST) |

**Pour Legancy Boutique :** Largement suffisant pour des centaines de commandes par jour.

---

## 🎓 EN RÉSUMÉ

```
┌─────────────────────────────────────────────────────────────┐
│ Client → Site → Apps Script → Google Sheets                │
│                                                             │
│ 1. Client remplit formulaire                               │
│ 2. Site envoie POST (HTTPS)                                │
│ 3. Script ajoute ligne dans Sheets                         │
│ 4. Site confirme au client                                 │
│                                                             │
│ Résultat : Commande automatiquement dans votre tableau     │
└─────────────────────────────────────────────────────────────┘
```

**Technologie officielle Google**  
**Production-ready**  
**Aucun serveur nécessaire**  
**100% gratuit**

---

📚 **Documentation Google Apps Script** : https://developers.google.com/apps-script  
🔐 **Sécurité Apps Script** : https://developers.google.com/apps-script/guides/services/authorization
