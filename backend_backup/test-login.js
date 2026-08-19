const axios = require('axios');

const URL = 'https://securemate-backend-env.up.railway.app/api/auth/login';
const PAYLOAD = {
    email: 'naduniwanniarachchi919@gmail.com',
    password: 'abc123' // Or whatever password you're testing with
};

async function testLogin() {
    console.log(`Testing Login at: ${URL}`);
    console.log(`Payload:`, PAYLOAD);

    try {
        const response = await axios.post(URL, PAYLOAD, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        console.log('--- SUCCESS ---');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.log('--- FAILED ---');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error Message:', error.message);
            console.log('Error Code:', error.code);
        }
    }
}

testLogin();
