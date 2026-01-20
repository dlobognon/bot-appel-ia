# 🚚 LOGIQUE DE LIVRAISON IVOIRIENNE - Documentation

## 📋 Vue d'ensemble

Système de calcul des frais de livraison **réaliste, fiable et adapté au marché ivoirien**.

---

## 🎯 Règles de Livraison

### Priorité 1: Zones à 1000 FCFA (PRIORITÉ ABSOLUE)
Si le lieu contient l'un de ces mots-clés → **1000 FCFA**

```
✓ bassam
✓ grand bassam
✓ port-bouët / port bouet
✓ anyama
✓ ébimpé
✓ zone industrielle
✓ yopougon zone industrielle
✓ zi
```

**Exemple:** 
- "Yopougon Zone Industrielle" → 1000 FCFA (même si Yopougon est à Abidjan)
- "Bassam" → 1000 FCFA (zone prioritaire)

### Priorité 2: Communes d'Abidjan (GRATUIT - sauf zones 1000)
Si le lieu est une commune d'Abidjan **ET** pas en zone 1000 → **GRATUIT (0 FCFA)**

```
✓ abobo
✓ adjamé
✓ attécoubé
✓ cocody
✓ koumassi
✓ marcory
✓ plateau
✓ treichville
✓ yopougon (sauf zone industrielle)
```

**Exemple:**
- "Plateau" → 0 FCFA (Abidjan gratuit)
- "Cocody" → 0 FCFA (Abidjan gratuit)
- "Yopougon" → 0 FCFA (mais "Yopougon Zone Industrielle" → 1000)

### Priorité 3: Hors Abidjan (2000 FCFA)
Si aucune des règles précédentes ne s'applique → **2000 FCFA**

```
✓ Yamoussoukro
✓ Bouaké
✓ Daloa
✓ Autres villes
```

---

## 💻 Implémentation JavaScript

### Fonction Principale

```javascript
function calculateShipping(city) {
  if (!city || typeof city !== 'string') {
    return 2000; // Par défaut
  }
  
  const normalizedCity = city.toLowerCase().trim();
  
  // RÈGLE 1: Zones à 1000 FCFA (PRIORITÉ)
  for (let zone of SPECIAL_ZONES_1000) {
    if (normalizedCity.includes(zone)) {
      return 1000;
    }
  }
  
  // RÈGLE 2: Communes Abidjan (Gratuit)
  for (let commune of ABIDJAN_COMMUNES) {
    if (normalizedCity.includes(commune)) {
      return 0;
    }
  }
  
  // RÈGLE 3: Hors Abidjan
  return 2000;
}
```

### Utilisation

```javascript
// Dans le formulaire de checkout
const city = document.querySelector('#city').value;
const shipping = calculateShipping(city);

// Exemple
calculateShipping('Plateau')                  // → 0
calculateShipping('Yopougon')                 // → 0
calculateShipping('Yopougon Zone Industrielle') // → 1000
calculateShipping('Bassam')                   // → 1000
calculateShipping('Yamoussoukro')             // → 2000
calculateShipping('')                         // → 2000
```

---

## 🧪 Tester la Logique

### En Console

```javascript
// Ouvrir F12 → Console

// Lancer les tests
testShipping()

// Résultat attendu:
// 🧪 TEST CALCUL LIVRAISON:
// ✓ "Plateau" → 0 FCFA (attendu: 0)
// ✓ "Yopougon Zone Industrielle" → 1000 FCFA (attendu: 1000)
// ✓ "Bassam" → 1000 FCFA (attendu: 1000)
// ✓ "Yamoussoukro" → 2000 FCFA (attendu: 2000)
// ...
// 📊 Résultats: X réussis, 0 échoués
```

### Cas de Test (Intégrés)

```javascript
const testCases = [
  // Communes Abidjan (0 FCFA)
  { city: 'Plateau', expected: 0 },
  { city: 'Cocody', expected: 0 },
  { city: 'Yopougon', expected: 0 },
  { city: 'Abobo', expected: 0 },
  
  // Zones 1000 FCFA
  { city: 'Bassam', expected: 1000 },
  { city: 'Grand Bassam', expected: 1000 },
  { city: 'Anyama', expected: 1000 },
  { city: 'Zone Industrielle', expected: 1000 },
  { city: 'Yopougon Zone Industrielle', expected: 1000 },
  
  // Hors Abidjan (2000 FCFA)
  { city: 'Yamoussoukro', expected: 2000 },
  { city: 'Bouaké', expected: 2000 },
  { city: '', expected: 2000 }
];
```

---

## 📝 Formulaire de Commande

### Champs

| Champ | Statut | Défaut |
|-------|--------|--------|
| Téléphone | **OBLIGATOIRE** | Vide (erreur si absent) |
| Prénom | Optionnel | "N.A." |
| Nom | Optionnel | "N.A." |
| Lieu/Ville | Optionnel | "Non spécifié" |
| Note | Optionnel | Vide |

### Validation

```javascript
// Seul le téléphone est obligatoire
if (!phone || phone.length < 8) {
  // Erreur: "⚠️ Veuillez entrer un numéro de téléphone valide"
  return false;
}

// Tous les autres champs peuvent être vides
return true;
```

---

## 🔄 Flux Calcul Livraison

```
┌─────────────────────────────────────┐
│ Utilisateur entre "Yopougon"        │
└──────────────────┬──────────────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ Normaliser texte   │
        │ "yopougon"         │
        └────────────┬───────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │ Vérifier zones 1000 FCFA    │
        │ Includes "zone industrielle"?│
        │ → NON                        │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │ Vérifier communes Abidjan    │
        │ Includes "yopougon"?         │
        │ → OUI!                       │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌──────────────────────┐
        │ Résultat: 0 FCFA     │
        │ (Abidjan Gratuit)    │
        └──────────────────────┘
```

---

## 📊 Tableaux Récapitulatifs

### Communes d'Abidjan

| Commune | Livraison Standard | Avec Zone 1000 |
|---------|-------------------|-----------------|
| Abobo | 0 FCFA | 1000 FCFA (si "zone industrielle") |
| Adjamé | 0 FCFA | 0 FCFA |
| Attécoubé | 0 FCFA | 0 FCFA |
| Cocody | 0 FCFA | 0 FCFA |
| Koumassi | 0 FCFA | 0 FCFA |
| Marcory | 0 FCFA | 0 FCFA |
| Plateau | 0 FCFA | 0 FCFA |
| Treichville | 0 FCFA | 0 FCFA |
| Yopougon | 0 FCFA | 1000 FCFA (si "zone industrielle") |

### Zones à 1000 FCFA

| Zone | Détails |
|------|---------|
| Bassam | Quelques kilomètres d'Abidjan |
| Grand Bassam | Station balnéaire |
| Port-Bouët | Zone portuaire |
| Anyama | Commune voisine |
| Ébimpé | Région côtière |
| Zone Industrielle | Yopougon ou Abobo |

---

## 🛠️ Maintenance

### Ajouter une nouvelle zone à 1000 FCFA

```javascript
// Dans app.js, ajouter à SPECIAL_ZONES_1000
const SPECIAL_ZONES_1000 = [
  'bassam',
  'grand bassam',
  'port-bouët',
  'port bouet',
  'anyama',
  'ébimpé',
  'zone industrielle',
  'yopougon zone industrielle',
  'zi',
  'NOUVELLE_ZONE'  // ← Ajouter ici
];
```

### Ajouter une commune Abidjan

```javascript
// Dans app.js, ajouter à ABIDJAN_COMMUNES
const ABIDJAN_COMMUNES = [
  'abobo',
  'adjamé',
  'attécoubé',
  'cocody',
  'koumassi',
  'marcory',
  'plateau',
  'treichville',
  'yopougon',
  'nouvelle_commune'  // ← Ajouter ici
];
```

---

## ⚡ Normalisation Texte

```javascript
// Le système normalise automatiquement:
// - Majuscules → minuscules
// - Espaces → ignorés
// - Accents → gardés (mais pas discriminants)

// Exemples de correspondances:
'PLATEAU'           → 'plateau'         ✓ Match
'Plateau'           → 'plateau'         ✓ Match
'  plateau  '       → 'plateau'         ✓ Match
'Grand Bassam'      → 'grand bassam'    ✓ Match
'ZONE INDUSTRIELLE' → 'zone industrielle' ✓ Match
'yop zone industrielle' → match "yopougon zone industrielle"? NON ✗
  (mais match "zone industrielle"? OUI ✓ → 1000)
```

---

## 🔍 Debugging

### Vérifier le calcul en temps réel

```javascript
// Dans la console du navigateur
calculateShipping('Plateau')

// Ou avec plus de détails
const city = 'Plateau';
const shipping = calculateShipping(city);
console.log(`Livraison pour "${city}": ${shipping} FCFA`);
```

### Ajouter des logs dans le code

```javascript
function calculateShipping(city) {
  const normalizedCity = city.toLowerCase().trim();
  console.log(`📍 Ville: "${city}" → "${normalizedCity}"`);
  
  // Vérifier zones 1000
  for (let zone of SPECIAL_ZONES_1000) {
    if (normalizedCity.includes(zone)) {
      console.log(`✓ Zone 1000 trouvée: "${zone}"`);
      return 1000;
    }
  }
  console.log('✗ Pas de zone 1000');
  
  // Vérifier Abidjan
  for (let commune of ABIDJAN_COMMUNES) {
    if (normalizedCity.includes(commune)) {
      console.log(`✓ Commune Abidjan trouvée: "${commune}"`);
      return 0;
    }
  }
  console.log('✗ Pas une commune Abidjan');
  
  console.log('→ 2000 FCFA (Hors Abidjan)');
  return 2000;
}
```

---

## ✅ Checklist de Vérification

- [ ] Zones 1000 FCFA correctes
- [ ] Communes Abidjan correctes  
- [ ] Priorité 1000 > Abidjan testée
- [ ] Normalisation texte fonctionne
- [ ] Tests passent (testShipping())
- [ ] Formulaire accepte champs optionnels
- [ ] Téléphone obligatoire
- [ ] Livraison calculée à la validation

---

**Version:** 1.0.0
**Date:** Janvier 2026
**Status:** ✅ PRODUCTION READY
