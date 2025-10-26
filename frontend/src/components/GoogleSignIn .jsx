import { useEffect, useContext, useState } from 'react';
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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Combined loading state
    const isProcessing = isLoading || isGoogleLoading;

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

            script.onerror = () => {
                console.error('Failed to load Google Sign-In script');
                setIsGoogleLoading(false);
            };
        } else {
            initializeGoogle();
        }
    }, []);

    const initializeGoogle = () => {
        if (window.google) {
            try {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                    locale: 'en',
                    cancel_on_tap_outside: true,
                });
            } catch (error) {
                console.error('Google initialization error:', error);
            }
        }
    };

    const handleCredentialResponse = async (response) => {
        if (!response || !response.credential) {
            console.error('No credential received from Google');
            setIsGoogleLoading(false);
            return;
        }

        setIsGoogleLoading(true);
        try {
            await googleLogin(response.credential);
            // Only navigate on success
            navigate("/", { replace: true });
        } catch (error) {
            console.error('Google sign-in error:', error);
            // Error toast is shown by authStore, just reset loading
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        if (!window.google) {
            console.error('Google Sign-In not initialized');
            return;
        }

        if (isProcessing) {
            return; // Prevent multiple clicks
        }

        try {
            // Show immediate loading feedback
            setIsGoogleLoading(true);

            // Use the popup method
            window.google.accounts.id.prompt((notification) => {
                // Handle notification states
                if (notification.isNotDisplayed()) {
                    console.log('Google prompt not displayed');
                    setIsGoogleLoading(false);

                    // Fallback: render hidden button and click it
                    const tempDiv = document.createElement('div');
                    tempDiv.style.display = 'none';
                    document.body.appendChild(tempDiv);

                    window.google.accounts.id.renderButton(tempDiv, {
                        theme: 'outline',
                        size: 'large',
                    });

                    setTimeout(() => {
                        const btn = tempDiv.querySelector('div[role="button"]');
                        if (btn) {
                            btn.click();
                        } else {
                            setIsGoogleLoading(false);
                        }
                        if (document.body.contains(tempDiv)) {
                            document.body.removeChild(tempDiv);
                        }
                    }, 100);
                } else if (notification.isSkippedMoment()) {
                    console.log('Google prompt skipped');
                    setIsGoogleLoading(false);
                } else if (notification.isDismissedMoment()) {
                    console.log('Google prompt dismissed');
                    setIsGoogleLoading(false);
                }
                // If displayed successfully, loading will be handled by callback
            });
        } catch (error) {
            console.error('Error triggering Google Sign-In:', error);
            setIsGoogleLoading(false);
        }
    };

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
                disabled={isProcessing}
                className={`relative w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300 flex cursor-pointer items-center justify-center gap-3 group ${!isProcessing ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
                    } ${theme === 'dark'
                        ? 'bg-gray-800 text-white border-2 border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-white text-gray-800 border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    } ${!isProcessing && theme === 'dark'
                        ? 'hover:bg-gray-700 hover:border-gray-600 hover:shadow-xl'
                        : !isProcessing && theme === 'light'
                            ? 'hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl'
                            : ''
                    }`}
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Loader className="animate-spin" size={22} />
                        <span className="text-sm">
                            {isGoogleLoading ? 'Signing in with Google...' : 'Please wait...'}
                        </span>
                    </div>
                ) : (
                    <>
                        <img
                            src="/google-icon.svg"
                            alt="Google"
                            className="w-5 h-5 mr-2" // adjust size if needed
                        />
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