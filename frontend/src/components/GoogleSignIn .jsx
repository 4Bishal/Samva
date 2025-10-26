import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeContext } from '../utils/ThemeProvider';
import { themeColors } from '../utils/themeColor';
import { Loader } from 'lucide-react';

const GoogleSignIn = () => {
    const { googleLogin, isLoading } = useAuthStore();
    const { theme } = useContext(ThemeContext);
    const colors = themeColors[theme];
    const navigate = useNavigate();

    useEffect(() => {
        // Load Google Sign-In script
        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                initializeGoogle();
            };
        } else {
            initializeGoogle();
        }
    }, []);

    const initializeGoogle = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                locale: 'en',
            });
        }
    };

    const handleCredentialResponse = async (response) => {
        try {
            await googleLogin(response.credential);
            navigate("/", { replace: true });
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    const handleGoogleSignIn = () => {
        if (window.google) {
            // Use the popup method which shows generic button
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // If prompt doesn't show, render a temporary button and click it
                    const tempDiv = document.createElement('div');
                    tempDiv.style.display = 'none';
                    document.body.appendChild(tempDiv);

                    window.google.accounts.id.renderButton(tempDiv, {
                        theme: 'outline',
                        size: 'large',
                    });

                    // Click the button programmatically
                    setTimeout(() => {
                        const btn = tempDiv.querySelector('div[role="button"]');
                        if (btn) btn.click();
                        document.body.removeChild(tempDiv);
                    }, 100);
                }
            });
        }
    };

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4" />
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853" />
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05" />
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335" />
        </svg>
    );

    return (
        <div>
            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                <span className={`text-sm font-medium transition-colors duration-500 ${colors.subText}`}>
                    OR
                </span>
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
            </div>

            {/* Custom Google Sign-In Button - Always shows generic "Sign in with Google" */}
            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`relative w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] ${theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700 hover:border-gray-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                    }`}
            >
                {isLoading ? (
                    <Loader className="animate-spin" size={22} />
                ) : (
                    <>
                        <div className="transition-transform duration-300 group-hover:scale-110">
                            <GoogleIcon />
                        </div>
                        <span className="transition-all duration-300">
                            Sign in with Google
                        </span>
                    </>
                )}
            </button>
        </div>
    );
};

export default GoogleSignIn;