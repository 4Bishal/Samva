import { useEffect, useContext } from 'react';
import { useAuthStore } from '../store/authStore';
import { ThemeContext } from '../utils/ThemeProvider';
import { themeColors } from '../utils/themeColor';
import { Loader } from 'lucide-react';

const GoogleSignIn = () => {
    const { googleLogin, isLoading } = useAuthStore();
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];

    useEffect(() => {
        // Check if script already exists
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            initializeGoogleButton();
            return;
        }

        // Load Google Sign-In script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            initializeGoogleButton();
        };

        return () => {
            // Only remove if this is the last instance
            const buttons = document.querySelectorAll('[id^="googleSignInButton"]');
            if (buttons.length <= 1) {
                const scriptTag = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
                if (scriptTag) {
                    document.body.removeChild(scriptTag);
                }
            }
        };
    }, [theme]); // Re-initialize when theme changes

    const initializeGoogleButton = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            // Render with theme-appropriate styling
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                {
                    theme: theme === 'dark' ? 'filled_black' : 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    width: '100%',
                    logo_alignment: 'left',
                }
            );
        }
    };

    const handleCredentialResponse = async (response) => {
        try {
            await googleLogin(response.credential);
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    return (
        <div className="mt-6">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                <span className={`text-sm transition-colors duration-500 ${colors.subText}`}>
                    OR
                </span>
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
            </div>

            {/* Google Button Container */}
            <div className="relative w-full flex justify-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-10">
                        <Loader className={`animate-spin ${colors.primary}`} size={24} />
                    </div>
                )}
                <div
                    id="googleSignInButton"
                    className={`w-full ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    style={{ maxWidth: '100%' }}
                ></div>
            </div>
        </div>
    );
};

export default GoogleSignIn;