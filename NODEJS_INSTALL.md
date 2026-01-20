# 📥 Installation de Node.js sur Windows

## Problème: "npm n'est pas reconnu"

Cette erreur signifie que Node.js n'est pas installé sur votre ordinateur. Node.js inclut npm (le gestionnaire de packages).

## Solution: Installer Node.js

### Méthode 1: Installation Standard (Recommandée)

#### 1. Télécharger Node.js

1. Allez sur: https://nodejs.org/
2. Téléchargez la version **LTS** (Long Term Support) - bouton vert
   - Exemple: "20.11.0 LTS Recommended For Most Users"
3. Le fichier téléchargé s'appelle: `node-v20.11.0-x64.msi`

#### 2. Installer Node.js

1. **Double-cliquez** sur le fichier téléchargé
2. Cliquez sur **Next** (Suivant)
3. Acceptez la licence → **Next**
4. Laissez le chemin par défaut → **Next**
5. **IMPORTANT**: Cochez "Automatically install the necessary tools"
6. Cliquez sur **Next** puis **Install**
7. Attendez la fin de l'installation
8. Cliquez sur **Finish**

#### 3. Vérifier l'Installation

**IMPORTANT:** Fermez et rouvrez PowerShell (obligatoire!)

Puis testez:

```powershell
# Vérifier Node.js
node --version
# Devrait afficher: v20.11.0 (ou similaire)

# Vérifier npm
npm --version
# Devrait afficher: 10.2.4 (ou similaire)
```

Si vous voyez les versions, **c'est bon !** ✅

### Méthode 2: Installation avec Winget (Alternative)

Si vous avez Windows 10/11 récent:

```powershell
# Installer Node.js via winget
winget install OpenJS.NodeJS.LTS

# Fermer et rouvrir PowerShell
# Puis vérifier
node --version
npm --version
```

### Méthode 3: Installation avec Chocolatey (Alternative)

Si vous avez Chocolatey installé:

```powershell
# Installer Node.js via Chocolatey
choco install nodejs-lts

# Fermer et rouvrir PowerShell
# Puis vérifier
node --version
npm --version
```

## ✅ Installation Réussie - Continuer

Une fois Node.js installé et les versions affichées correctement:

### Retour au Projet

```powershell
# 1. Aller dans le dossier du projet
cd "c:\Users\PC\Documents\BOT APPEL ET MESSAGE"

# 2. Installer les dépendances
npm install

# 3. Suivre le reste du guide QUICKSTART.md
```

## ❌ Problèmes Courants

### Erreur: "npm n'est pas reconnu" APRÈS installation

**Solution 1:** Vous devez FERMER et ROUVRIR PowerShell
1. Fermez complètement la fenêtre PowerShell
2. Ouvrez une NOUVELLE fenêtre PowerShell
3. Retestez: `node --version` et `npm --version`

**Solution 2:** Si fermer/rouvrir ne suffit pas, rafraîchir le PATH dans la session actuelle
```powershell
# Rafraîchir les variables d'environnement
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Puis retester
npm --version
```

### Erreur: "Impossible d'exécuter des scripts"

Si vous avez l'erreur "l'exécution de scripts est désactivée sur ce système":

```powershell
# 1. Autoriser les scripts (recommandé)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 2. Rafraîchir le PATH si nécessaire
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 3. Tester npm
npm --version
```

**Explication:**
- `RemoteSigned` permet d'exécuter les scripts locaux et signés
- `-Scope CurrentUser` affecte uniquement votre utilisateur (pas besoin d'admin)
- C'est sécurisé et recommandé par Microsoft

### Erreur: "Access Denied" ou "Permission Denied"

**Solution:** Lancez PowerShell en tant qu'administrateur
1. Clic droit sur PowerShell
2. "Exécuter en tant qu'administrateur"
3. Refaites l'installation

### Node.js installé mais npm ne fonctionne pas

**Solution:** Réparer l'installation
1. Panneau de configuration → Programmes
2. Trouvez "Node.js"
3. Clic droit → "Réparer"
4. Ou désinstallez et réinstallez

## 📊 Versions Recommandées

- **Node.js:** v18.x ou v20.x (LTS)
- **npm:** v9.x ou v10.x (inclus avec Node.js)

## 🔍 Vérification Complète

Une fois tout installé, vérifiez que tout fonctionne:

```powershell
# Versions
node --version          # v20.11.0
npm --version           # 10.2.4

# Chemin Node.js
where.exe node          # C:\Program Files\nodejs\node.exe

# Chemin npm
where.exe npm           # C:\Program Files\nodejs\npm.cmd

# Test npm
npm help                # Affiche l'aide npm
```

Si toutes ces commandes fonctionnent, **vous êtes prêt !** ✅

## 🎯 Prochaine Étape

Retournez au guide [QUICKSTART.md](QUICKSTART.md) et continuez à partir de l'étape 1:

```powershell
cd "c:\Users\PC\Documents\BOT APPEL ET MESSAGE"
npm install
```

## 💡 Conseils

### Mise à Jour Future de npm

Pour mettre à jour npm plus tard:
```powershell
npm install -g npm@latest
```

### Variables d'Environnement

Node.js devrait automatiquement ajouter son chemin aux variables d'environnement.

Si ce n'est pas le cas:
1. Recherchez "Variables d'environnement" dans Windows
2. Variables système → PATH → Modifier
3. Ajoutez: `C:\Program Files\nodejs\`

## 🆘 Support

Si vous avez toujours des problèmes:
1. Désinstallez complètement Node.js
2. Redémarrez votre ordinateur
3. Réinstallez Node.js avec la méthode 1
4. Fermez et rouvrez PowerShell
5. Retestez

---

**Une fois Node.js installé, revenez au [QUICKSTART.md](QUICKSTART.md) !**
