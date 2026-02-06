import fetch from 'node-fetch';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiVXN1YXJpbyBkZSBwcnVlYmEiLCJpYXQiOjE3NzAzODYyMDMsImV4cCI6MTc3MDM4OTgwM30.UBw-obPeigRuS9mI5eelqXB-EWKzq5RSon17hyFYvUE';

async function testEndpoint() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/transacciones', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
    } catch (error) {
        console.error('Error testing endpoint:', error);
    }
}

testEndpoint();