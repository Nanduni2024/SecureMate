const fs = require('fs');
const path = require('path');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore: getAdminFirestore } = require('firebase-admin/firestore');

const isPlaceholder = (value) => {
    if (!value) return true;

    const normalized = value.toLowerCase();
    return normalized.startsWith('your_')
        || normalized.startsWith('replace_with_')
        || normalized.includes('your_private_key_here')
        || normalized.includes('paste_new_private_key_here');
};

const getCredential = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    }

    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (!isPlaceholder(serviceAccountPath)) {
        const resolvedPath = path.isAbsolute(serviceAccountPath)
            ? serviceAccountPath
            : path.resolve(__dirname, '..', serviceAccountPath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Firebase service account file was not found at ${resolvedPath}. Download a new private key from Firebase Console or update FIREBASE_SERVICE_ACCOUNT_PATH.`);
        }

        return cert(require(resolvedPath));
    }

    const localCredential = fs.readdirSync(path.join(__dirname, '..', 'credentials'))
        .find(file => file.endsWith('.json'));
    if (localCredential) {
        return cert(require(path.join(__dirname, '..', 'credentials', localCredential)));
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!isPlaceholder(projectId) && !isPlaceholder(clientEmail) && !isPlaceholder(privateKey)) {
        return cert({
            projectId,
            clientEmail,
            privateKey
        });
    }

    return null;
};

const getFirestore = () => {
    if (!getApps().length) {
        const credential = getCredential();

        if (!credential) {
            throw new Error('Firebase credentials are not configured. Download a Firebase Admin SDK private key or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env.');
        }

        initializeApp({ credential });
    }

    return getAdminFirestore();
};

module.exports = getFirestore;
