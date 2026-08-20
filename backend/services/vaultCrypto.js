const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

function getKey() {
  const configuredKey = process.env.VAULT_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (configuredKey && !configuredKey.includes('your_')) {
    return crypto.createHash('sha256').update(configuredKey).digest();
  }

  const credentialPath = path.join(__dirname, '..', 'credentials');
  const credentialFile = fs.readdirSync(credentialPath).find(file => file.endsWith('.json'));
  if (credentialFile) {
    const serviceAccount = JSON.parse(fs.readFileSync(path.join(credentialPath, credentialFile), 'utf8'));
    if (serviceAccount.private_key) return crypto.createHash('sha256').update(serviceAccount.private_key).digest();
  }

  throw new Error('Vault encryption requires VAULT_ENCRYPTION_KEY or a configured Firebase service account.');
}

function encryptSecret(value) {
  if (value === undefined || value === null || value === '') return value;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

function decryptSecret(value) {
  if (!value || !String(value).startsWith('v1:')) return value;
  const [, ivValue, tagValue, encryptedValue] = String(value).split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivValue, 'base64'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'base64')), decipher.final()]).toString('utf8');
}

module.exports = { encryptSecret, decryptSecret };