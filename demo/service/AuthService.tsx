import { Demo } from '@/types';

export const AuthService = {
    async authenticate(data: any) {
        const loginData = data;

        try {
            const response = await fetch('http://localhost/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                // Successful login
                const responseData = await response.json();

                console.log('Login successful:', responseData);
                return responseData;
            } else {
                // Failed login

                const errorData = await response.json();
                console.error('Login failed:', errorData);
                return errorData;
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
};
