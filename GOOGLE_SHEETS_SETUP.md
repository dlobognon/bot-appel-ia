# Configuration Google Sheets

## Étape 1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Nommez-le (ex: "bot-appel-commandes")

## Étape 2: Activer l'API Google Sheets

1. Dans le menu, allez à **APIs & Services** → **Library**
2. Recherchez "Google Sheets API"
3. Cliquez sur **Enable**

## Étape 3: Créer un compte de service

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **Service Account**
3. Remplissez:
   - Nom: "bot-appel-service"
   - Description: "Service account pour bot d'appel"
4. Cliquez sur **Create and Continue**
5. Rôle: Sélectionnez **Editor**
6. Cliquez sur **Done**

## Étape 4: Générer la clé JSON

1. Dans la liste des comptes de service, cliquez sur celui que vous venez de créer
2. Allez dans l'onglet **Keys**
3. Cliquez sur **Add Key** → **Create new key**
4. Sélectionnez **JSON**
5. Cliquez sur **Create**
6. Un fichier JSON sera téléchargé automatiquement

## Étape 5: Configurer le projet

1. Renommez le fichier téléchargé en `credentials.json`
2. Placez-le à la racine de votre projet:
   ```
   BOT APPEL ET MESSAGE/
   ├── credentials.json  ← ici
   ├── server.js
   └── ...
   ```

## Étape 6: Préparer votre Google Sheet

### Structure requise de la feuille

Créez une feuille Google Sheets nommée **"Commandes"** avec ces colonnes (A à G):

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Date Commande** | **Nom Client** | **Téléphone** | **Produits** | **Adresse Livraison** | **Statut** | **Notes** |
| 2026-01-03 | Jean Dupont | +33612345678 | 2x Pizza Margherita | 10 rue de Paris, 75001 | pending | |
| 2026-01-03 | Marie Martin | +33687654321 | 1x Burger | 5 av. des Champs, 75008 | pending | |

**Important:**
- La première ligne (ligne 1) contient les en-têtes
- Les données commencent à la ligne 2
- Le téléphone doit être au format international (+33...)
- Le statut initial doit être "pending"

### Créer la feuille

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau tableur
3. Nommez la première feuille **"Commandes"** (clic droit sur l'onglet → Renommer)
4. Ajoutez les en-têtes dans la première ligne
5. Notez l'ID du document dans l'URL:
   ```
   https://docs.google.com/spreadsheets/d/[VOTRE_ID_ICI]/edit
   ```

## Étape 7: Partager la feuille avec le compte de service

1. Dans votre fichier `credentials.json`, cherchez la ligne `"client_email"`
2. Copiez cette adresse email (elle ressemble à: `bot-appel-service@...iam.gserviceaccount.com`)
3. Dans Google Sheets, cliquez sur **Partager**
4. Collez l'email du compte de service
5. Donnez les droits **Éditeur**
6. Cliquez sur **Envoyer**

## Étape 8: Configurer les variables d'environnement

Dans votre fichier `.env`:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j  # L'ID de votre Google Sheet
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

## Étape 9: Tester la connexion

Démarrez votre serveur:

```bash
npm run dev
```

Vous devriez voir dans les logs:
```
✅ Google Sheets API initialisée
✅ Google Sheets connecté
```

## Exemple de données de test

Voici quelques lignes de test à ajouter dans votre feuille:

```
Date Commande    | Nom Client      | Téléphone       | Produits              | Adresse Livraison          | Statut  | Notes
2026-01-03       | Jean Dupont     | +33612345678    | 2x Pizza Margherita   | 10 rue de Paris, 75001     | pending |
2026-01-03       | Marie Martin    | +33687654321    | 1x Burger + Frites    | 5 av. des Champs, 75008    | pending |
2026-01-03       | Pierre Durand   | +33698765432    | 3x Salade César       | 20 bd Saint-Michel, 75005  | pending |
```

## Fonctionnement du bot

1. **Synchronisation**: Le bot vérifie Google Sheets toutes les 5 minutes
2. **Import**: Les nouvelles commandes avec statut "pending" sont importées
3. **Appel**: Le bot appelle automatiquement dans les horaires configurés (8h-18h)
4. **Mise à jour**: Le statut et les notes sont mis à jour automatiquement dans Google Sheets

### Statuts possibles

- `pending`: Nouvelle commande, en attente d'appel
- `imported`: Importée dans le système
- `confirmed`: Client a confirmé la commande
- `cancelled`: Client a annulé
- `retry`: À rappeler (client pas disponible)
- `failed`: Échec après 3 tentatives

## Sécurité

⚠️ **IMPORTANT:**

1. Ne JAMAIS committer `credentials.json` dans Git
2. Le fichier est déjà dans `.gitignore`
3. Gardez vos identifiants secrets
4. Limitez les permissions du compte de service au strict nécessaire

## Dépannage

### Erreur "Fichier credentials.json non trouvé"
- Vérifiez que le fichier est à la racine du projet
- Vérifiez le chemin dans `.env`

### Erreur "Permission denied"
- Vérifiez que vous avez bien partagé la feuille avec l'email du compte de service
- Vérifiez que les droits sont en "Éditeur"

### Erreur "Unable to parse range: Commandes!A2:G"
- Vérifiez que la feuille s'appelle exactement "Commandes"
- Vérifiez que les en-têtes sont dans la ligne 1

### Aucune commande importée
- Vérifiez que le statut est bien "pending" (en minuscules)
- Vérifiez que les numéros de téléphone sont au format international (+33...)
- Regardez les logs dans `logs/combined.log`

## Support

Pour plus d'aide:
- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [Guide des comptes de service](https://cloud.google.com/iam/docs/service-accounts)
