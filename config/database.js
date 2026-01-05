const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

const dbPath = path.join(__dirname, '../data/orders.db');

// Créer la connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error('Erreur de connexion à la base de données:', err);
  } else {
    logger.info('Connecté à la base de données SQLite');
    initDatabase();
  }
});

// Initialiser les tables
function initDatabase() {
  // Table des commandes
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sheet_row INTEGER UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      products TEXT NOT NULL,
      order_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      call_attempts INTEGER DEFAULT 0,
      last_call_date TEXT,
      last_call_status TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur création table orders:', err);
    }
  });

  // Table des appels
  db.run(`
    CREATE TABLE IF NOT EXISTS calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      call_sid TEXT,
      phone_number TEXT NOT NULL,
      status TEXT,
      duration INTEGER,
      recording_url TEXT,
      transcription TEXT,
      ai_summary TEXT,
      customer_response TEXT,
      call_date TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur création table calls:', err);
    }
  });

  // Table de conversation (pour l'IA)
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      call_sid TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur création table conversations:', err);
    }
  });
}

// Fonctions utilitaires pour les commandes
const OrderDB = {
  // Créer une nouvelle commande
  create: (orderData) => {
    return new Promise((resolve, reject) => {
      const { sheet_row, customer_name, customer_phone, delivery_address, products, order_date } = orderData;
      
      db.run(
        `INSERT INTO orders (sheet_row, customer_name, customer_phone, delivery_address, products, order_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sheet_row, customer_name, customer_phone, delivery_address, products, order_date],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  // Récupérer toutes les commandes en attente
  getPending: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM orders WHERE status IN ('pending', 'retry') ORDER BY created_at ASC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  // Récupérer une commande par ID
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM orders WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Mettre à jour le statut d'une commande
  updateStatus: (id, status, notes = null) => {
    return new Promise((resolve, reject) => {
      const query = notes 
        ? `UPDATE orders SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        : `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      const params = notes ? [status, notes, id] : [status, id];
      
      db.run(query, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // Incrémenter le nombre de tentatives d'appel
  incrementCallAttempts: (id, callStatus) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET 
         call_attempts = call_attempts + 1,
         last_call_date = CURRENT_TIMESTAMP,
         last_call_status = ?,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [callStatus, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  // Obtenir toutes les commandes
  getAll: (limit = 100) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

// Fonctions pour les appels
const CallDB = {
  create: (callData) => {
    return new Promise((resolve, reject) => {
      const { order_id, call_sid, phone_number, call_date } = callData;
      
      db.run(
        `INSERT INTO calls (order_id, call_sid, phone_number, call_date)
         VALUES (?, ?, ?, ?)`,
        [order_id, call_sid, phone_number, call_date],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  update: (call_sid, updateData) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updateData), call_sid];
      
      db.run(
        `UPDATE calls SET ${fields} WHERE call_sid = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  getByOrderId: (order_id) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM calls WHERE order_id = ? ORDER BY call_date DESC`,
        [order_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

// Fonctions pour les conversations
const ConversationDB = {
  add: (call_sid, role, content) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO conversations (call_sid, role, content) VALUES (?, ?, ?)`,
        [call_sid, role, content],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  getByCallSid: (call_sid) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM conversations WHERE call_sid = ? ORDER BY timestamp ASC`,
        [call_sid],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

module.exports = {
  db,
  OrderDB,
  CallDB,
  ConversationDB
};
