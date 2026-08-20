const getFirestore = require('../config/firebase');
const { encryptSecret, decryptSecret } = require('./vaultCrypto');

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
      this._db = getFirestore();
    }
    return this._db;
  }

  normalizeScan(scan) {
    if (!scan) return scan;
    return {
      ...scan,
      risk_level: scan.risk_level === 'low' ? 'safe' : scan.risk_level,
      threat_score: Number.isFinite(Number(scan.threat_score)) ? Number(scan.threat_score) : 0
    };
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
      return snapshot.docs.map(doc => this.decryptVaultItem({ _id: doc.id, ...doc.data() }));
    }
    const items = [];
    for (const [id, item] of this.memoryVault.entries()) {
      if (item.user_id === userId) items.push(this.decryptVaultItem({ _id: id, ...item }));
    }
    return items;
  }

  async addVaultItem(item) {
    const id = 'vault_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newItem = {
      ...item,
      created_at: new Date().toISOString()
    };
    delete newItem.password;
    delete newItem.note;
    if (item.password) newItem.password_encrypted = encryptSecret(item.password);
    if (item.note) newItem.note_encrypted = encryptSecret(item.note);
    if (this.db) {
      await this.db.collection('vault').doc(id).set(newItem);
      return this.decryptVaultItem({ _id: id, ...newItem });
    }
    this.memoryVault.set(id, newItem);
    return this.decryptVaultItem({ _id: id, ...newItem });
  }

  decryptVaultItem(item) {
    return {
      ...item,
      password: item.password_encrypted ? decryptSecret(item.password_encrypted) : item.password,
      note: item.note_encrypted ? decryptSecret(item.note_encrypted) : item.note
    };
  }

  async deleteVaultItem(id, userId) {
    if (this.db) {
      const docRef = this.db.collection('vault').doc(id);
      const doc = await docRef.get();
      if (!doc.exists || doc.data().user_id !== userId) return false;
      await docRef.delete();
      return true;
    }
    const item = this.memoryVault.get(id);
    if (!item || item.user_id !== userId) return false;
    this.memoryVault.delete(id);
    return true;
  }

  async getScans(userId) {
    if (this.db) {
      const snapshot = await this.db.collection('scans').where('user_id', '==', userId).get();
      return snapshot.docs
        .map(doc => this.normalizeScan({ _id: doc.id, ...doc.data() }))
        .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
    }
    const scans = [];
    for (const [id, scan] of this.memoryScans.entries()) {
      if (scan.user_id === userId) scans.push({ _id: id, ...scan });
    }
    return scans.sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
  }

  async getScanById(scanId, userId) {
    if (!scanId || !userId) return null;

    if (this.db) {
      const doc = await this.db.collection('scans').doc(scanId).get();
      if (!doc.exists || doc.data().user_id !== userId) return null;
      return this.normalizeScan({ _id: doc.id, ...doc.data() });
    }

    const scan = this.memoryScans.get(scanId);
    return scan && scan.user_id === userId ? this.normalizeScan({ _id: scanId, ...scan }) : null;
  }

  async addScan(scanData) {
    const id = 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newScan = {
      url: scanData.url,
      user_id: scanData.user_id,
      link_type: scanData.link_type || 'unknown',
      risk_level: scanData.risk_level || 'safe',
      threat_score: Number.isFinite(scanData.threat_score) ? scanData.threat_score : 5,
      ai_summary: scanData.ai_summary || 'No immediate threats were detected by the current URL analysis.',
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
