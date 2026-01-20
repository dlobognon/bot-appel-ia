# 📸 GUIDE VISUEL : DÉPLOYER GOOGLE APPS SCRIPT
## Instructions pas-à-pas avec captures d'écran

---

## 🎬 ÉTAPE 1 : Ouvrir Apps Script

```
┌─────────────────────────────────────────────────────┐
│  Google Sheets - Votre tableau                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Fichier  Édition  Affichage  Insertion  Format    │
│  ▼         ▼        ▼          ▼          ▼        │
│                                                     │
│  Données  Outils  Extensions  Aide                 │
│  ▼         ▼       ▼           ▼                   │
│                    │                               │
│                    ├─> Apps Script  ← CLIQUEZ ICI │
│                    ├─> Macros                      │
│                    └─> Modules complémentaires     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Action :** Cliquez sur **Extensions** → **Apps Script**

---

## 🎬 ÉTAPE 2 : Éditeur Apps Script

```
┌────────────────────────────────────────────────────────┐
│  Apps Script - Projet sans titre                      │
├────────────────────────────────────────────────────────┤
│  Fichier  Édition  Affichage  Exécuter  Déployer  Publier
│  
│  📁 Fichiers                 
│    └─ Code.gs               ← Vous êtes ici
│  
│  ┌──────────────────────────────────────────────────┐
│  │ function myFunction() {                          │
│  │   // Supprimez ce code                          │
│  │ }                                                │
│  │                                                  │
│  │ ← COLLEZ ICI le contenu de                      │
│  │    GOOGLE_SHEETS_SCRIPT.gs                       │
│  │                                                  │
│  └──────────────────────────────────────────────────┘
│
└────────────────────────────────────────────────────────┘
```

**Actions :**
1. Supprimez tout le code existant (Ctrl+A puis Suppr)
2. Copiez le contenu de `GOOGLE_SHEETS_SCRIPT.gs`
3. Collez-le dans l'éditeur
4. Enregistrez (icône 💾 ou Ctrl+S)

---

## 🎬 ÉTAPE 3 : Déployer l'application

```
┌────────────────────────────────────────────────────────┐
│  Apps Script                                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Exécuter ▶]  [Déboguer 🐞]  [DÉPLOYER ⚡] ← CLIC    │
│                                       │                │
│                                       ▼                │
│                          ┌────────────────────────┐   │
│                          │ Tester les déploiements│   │
│                          │ Gérer les déploiements │   │
│                          │ Nouveau déploiement ← │   │
│                          └────────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Action :** Cliquez sur **Déployer** → **Nouveau déploiement**

---

## 🎬 ÉTAPE 4 : Configurer le déploiement

```
┌────────────────────────────────────────────────────────┐
│  Nouveau déploiement                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ⚙️ Sélectionner le type                              │
│    [ ? ] Sélectionner le type ▼  ← CLIC              │
│                                                        │
│         ┌──────────────────────┐                      │
│         │ Module complémentaire│                      │
│         │ Application Web  ← SÉLECTIONNEZ            │
│         │ API exécutable       │                      │
│         │ Bibliothèque         │                      │
│         └──────────────────────┘                      │
│                                                        │
│  📝 Description                                        │
│    API Legancy Boutique                               │
│                                                        │
│  🔐 Exécuter en tant que                              │
│    [ Moi (votre@email.com) ▼ ]                       │
│                                                        │
│  👥 Qui a accès                                       │
│    [ Tout le monde ▼ ]  ← IMPORTANT                  │
│                                                        │
│                    [ Déployer ] ← CLIC               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions :**
1. Type : **Application Web**
2. Exécuter en tant que : **Moi**
3. Qui a accès : **Tout le monde**
4. Cliquez **Déployer**

---

## 🎬 ÉTAPE 5 : Autoriser l'accès

```
┌────────────────────────────────────────────────────────┐
│  Autorisation requise                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Ce projet nécessite votre autorisation pour          │
│  accéder à vos données.                               │
│                                                        │
│           [ Examiner les autorisations ]              │
│                                                        │
└────────────────────────────────────────────────────────┘

          ↓ CLIC

┌────────────────────────────────────────────────────────┐
│  Sélectionnez un compte                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  👤 votre@email.com  ← CLIC                           │
│                                                        │
└────────────────────────────────────────────────────────┘

          ↓

┌────────────────────────────────────────────────────────┐
│  ⚠️ Google n'a pas vérifié cette application          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Paramètres avancés ▼]  ← CLIC                       │
│                                                        │
│  Accéder à [Projet] (non sécurisé)  ← CLIC           │
│                                                        │
└────────────────────────────────────────────────────────┘

          ↓

┌────────────────────────────────────────────────────────┐
│  Autoriser                                             │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Nom projet] souhaite :                              │
│   ✓ Consulter et gérer vos feuilles de calcul        │
│                                                        │
│           [ Autoriser ] ← CLIC                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions :**
1. Cliquez **Examiner les autorisations**
2. Sélectionnez votre compte Google
3. Si avertissement : **Paramètres avancés** → **Accéder à... (non sécurisé)**
4. Cliquez **Autoriser**

---

## 🎬 ÉTAPE 6 : Copier l'URL

```
┌────────────────────────────────────────────────────────┐
│  ✅ Nouveau déploiement créé                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ID du déploiement :                                   │
│  AKfycby1234567890abcdefghijk...                      │
│                                                        │
│  URL Web App :                                         │
│  ┌──────────────────────────────────────────────┐    │
│  │ https://script.google.com/macros/s/          │    │
│  │ AKfycby.../exec                              │    │
│  │                                  [📋 Copier] │← CLIC
│  └──────────────────────────────────────────────┘    │
│                                                        │
│                                  [ OK ]                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Action :** 
- Cliquez sur **📋 Copier** pour copier l'URL
- **GARDEZ CETTE URL** pour l'étape suivante !

---

## 🎬 ÉTAPE 7 : Configurer le site

```
┌────────────────────────────────────────────────────────┐
│  checkout-modal.js (ligne 10)                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1  // ===== CHECKOUT MODAL =====                     │
│  2  class CheckoutModal {                             │
│  3    constructor() {                                 │
│  4      this.modal = null;                            │
│  5                                                     │
│  6      // ⚠️ IMPORTANT: Remplacez cette URL          │
│  7      this.googleSheetsURL =                        │
│  8        'https://script.google.com/macros/s/        │
│  9         VOTRE_URL_ICI/exec';                       │
│ 10           ↑                                         │
│ 11      COLLEZ ICI l'URL copiée à l'étape 6          │
│ 12                                                     │
│ 13      this.init();                                  │
│ 14    }                                               │
│ 15  }                                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Actions :**
1. Ouvrez `checkout-modal.js`
2. Ligne 10, remplacez `VOTRE_URL_ICI` par l'URL copiée
3. Enregistrez (Ctrl+S)

---

## ✅ TERMINÉ !

Testez maintenant en passant une commande sur votre site.
La commande doit apparaître dans votre Google Sheets ! 🎉

---

**Besoin d'aide ?** Consultez `SETUP_GOOGLE_SHEETS.md` pour plus de détails.
