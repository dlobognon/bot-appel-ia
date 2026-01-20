// ===== LEGANCY BOUTIQUE - GOOGLE APPS SCRIPT =====
// Script à copier dans Google Sheets : Extensions > Apps Script
// Ce script reçoit les commandes du site et les ajoute automatiquement au tableau

function doPost(e) {
  try {
    // Ouvrir le Google Sheets (utilise automatiquement le Sheets attaché)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Récupérer les données envoyées depuis le site
    const data = e.parameter;
    
    // Construire la date au format lisible
    const now = new Date();
    const date = Utilities.formatDate(now, "GMT+0", "dd/MM/yyyy HH:mm");
    
    // Parser les produits (envoyés en JSON)
    let produitsTexte = "";
    try {
      const items = JSON.parse(data.items);
      produitsTexte = items.map(item => `${item.name} x${item.quantity}`).join(", ");
    } catch (err) {
      produitsTexte = data.items || "N/A";
    }
    
    // Préparer les valeurs pour chaque colonne
    // Ordre: Date | Nom du client | Numéro | Lieu de livraison | Note | Produits | Prix | Statuts
    const rowData = [
      date,                                           // Date
      data.customerName || "N/A",                     // Nom du client
      data.phone || "",                               // Numéro
      data.city || "Non spécifié",                    // Lieu de livraison
      data.comment || "",                             // Note
      produitsTexte,                                  // Produits
      parseFloat(data.total) || 0,                    // Prix
      "Neutre"                                        // Statuts
    ];
    
    // Ajouter la ligne au tableau
    sheet.appendRow(rowData);
    
    // Retourner une réponse de succès
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Commande ajoutée avec succès" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // En cas d'erreur, retourner l'erreur
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction GET (optionnelle) pour tester le script
function doGet(e) {
  return ContentService
    .createTextOutput("Le script fonctionne! Utilisez POST pour envoyer des données.")
    .setMimeType(ContentService.MimeType.TEXT);
}
