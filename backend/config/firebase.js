const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore: getAdminFirestore } = require('firebase-admin/firestore');

const isPlaceholder = (value) => !value || value.startsWith('your_') || value.includes('your_private_key_here');

const getCredential = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    }

    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (!isPlaceholder(serviceAccountPath)) {
        return cert(require(serviceAccountPath));
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
            throw new Error('Firebase credentials are not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env.');
        }

        initializeApp({ credential });
    }

    return getAdminFirestore();
};

module.exports = getFirestore;
