// withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: any) => {
    const AuthGuard = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            // Check if token exists in session storage
            const token = sessionStorage.getItem('token');
            if (!token) {
                // Redirect to login if token is not present
                router.push('/auth/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };

    return AuthGuard;
};

export default withAuth;
