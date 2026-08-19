const getFirestore = require('../config/firebase');

class FirestoreStore {
  constructor() {
    this._db = null;
    this.memoryUsers = new Map();
    this.memoryProfiles = new Map();
    this.memorySettings = new Map();
    this.memoryVault = new Map();
    this.memoryScans = new Map();
  }

  get db() {
    if (this._db === null) {
      try {
        this._db = getFirestore();
      } catch (err) {
        console.warn('[FirestoreStore] Firebase not initialized, falling back to memory store:', err.message);
        this._db = false;
      }
    }
    return this._db;
  }

  async findUserByEmail(email) {
    if (!email) return null;
    const lowerEmail = email.toLowerCase();
    
    if (this.db) {
      const snapshot = await this.db.collection('users').where('email', '==', lowerEmail).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      const profile = await this.getProfile(doc.id);
      return { _id: doc.id, id: doc.id, ...doc.data(), ...profile };
    }

    for (const [id, user] of this.memoryUsers.entries()) {
      if (user.email === lowerEmail) {
        const profile = this.memoryProfiles.get(id) || {};
        return { _id: id, id, ...user, ...profile };
      }
    }
    return null;
  }

  async findUserById(id) {
    if (!id) return null;
    if (this.db) {
      const doc = await this.db.collection('users').doc(id).get();
      if (!doc.exists) return null;
      const profile = await this.getProfile(id);
      return { _id: doc.id, id: doc.id, ...doc.data(), ...profile };
    }

    const user = this.memoryUsers.get(id);
    if (!user) return null;
    const profile = this.memoryProfiles.get(id) || {};
    return { _id: id, id, ...user, ...profile };
  }

  async getProfile(userId) {
    if (this.db) {
      const doc = await this.db.collection('profiles').doc(userId).get();
      return doc.exists ? doc.data() : {};
    }
    return this.memoryProfiles.get(userId) || {};
  }

  async createUser(userData, customUid = null) {
    const email = userData.email.toLowerCase();
    const id = customUid || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newUser = {
      email,
      password: userData.password || null,
      googleId: userData.googleId || null,
      createdAt: new Date().toISOString()
    };

    if (this.db) {
      const docRef = this.db.collection('users').doc(id);
      await docRef.set(newUser, { merge: true });
      return { _id: id, id, ...newUser };
    }

    this.memoryUsers.set(id, newUser);
    return { _id: id, id, ...newUser };
  }

  async createProfile(profileData) {
    const { user_id, full_name, phone, avatar_url } = profileData;
    const existing = await this.getProfile(user_id);
    const updated = {
      full_name: full_name !== undefined ? full_name : (existing.full_name || ''),
      phone: phone !== undefined ? phone : (existing.phone || ''),
      avatar_url: avatar_url !== undefined ? avatar_url : (existing.avatar_url || ''),
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      await this.db.collection('profiles').doc(user_id).set(updated, { merge: true });
      return;
    }

    this.memoryProfiles.set(user_id, { ...existing, ...updated });
  }

  async getSettings(userId) {
    if (this.db) {
      const doc = await this.db.collection('settings').doc(userId).get();
      return doc.exists ? doc.data() : {};
    }
    return this.memorySettings.get(userId) || {};
  }

  async createSettings(settingsData) {
    const { user_id } = settingsData;
    const updated = { ...settingsData, updatedAt: new Date().toISOString() };

    if (this.db) {
      await this.db.collection('settings').doc(user_id).set(updated, { merge: true });
      return;
    }

    const existing = this.memorySettings.get(user_id) || {};
    this.memorySettings.set(user_id, { ...existing, ...updated });
  }

  async getVaultItems(userId) {
    if (this.db) {
      const snapshot = await this.db.collection('vault').where('user_id', '==', userId).get();
      return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    }
    const items = [];
    for (const [id, item] of this.memoryVault.entries()) {
      if (item.user_id === userId) items.push({ _id: id, ...item });
    }
    return items;
  }

  async addVaultItem(item) {
    const id = 'vault_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newItem = { ...item, created_at: new Date().toISOString() };
    if (this.db) {
      await this.db.collection('vault').doc(id).set(newItem);
      return { _id: id, ...newItem };
    }
    this.memoryVault.set(id, newItem);
    return { _id: id, ...newItem };
  }

  async deleteVaultItem(id) {
    if (this.db) {
      await this.db.collection('vault').doc(id).delete();
      return;
    }
    this.memoryVault.delete(id);
  }

  async getScans(userId) {
    if (this.db) {
      const snapshot = await this.db.collection('scans').where('user_id', '==', userId).get();
      return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    }
    const scans = [];
    for (const [id, scan] of this.memoryScans.entries()) {
      if (scan.user_id === userId) scans.push({ _id: id, ...scan });
    }
    return scans;
  }

  async addScan(scanData) {
    const id = 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newScan = {
      url: scanData.url,
      user_id: scanData.user_id,
      risk_level: 'low',
      threat_score: 95,
      created_at: new Date().toISOString()
    };
    if (this.db) {
      await this.db.collection('scans').doc(id).set(newScan);
      return { _id: id, ...newScan };
    }
    this.memoryScans.set(id, newScan);
    return { _id: id, ...newScan };
  }
}

module.exports = new FirestoreStore();
