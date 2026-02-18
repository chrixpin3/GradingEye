import fetch from 'node-fetch';

async function testSignup() {
    console.log('Testing signup endpoint...');

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            })
        });

        console.log('Status:', response.status);
        console.log('Headers:', response.headers.raw());

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

testSignup();
