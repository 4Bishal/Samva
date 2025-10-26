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
            // Cleanup is handled by Google's library
        };
    }, [theme]); // Re-initialize when theme changes

    const initializeGoogleButton = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            const buttonContainer = document.getElementById('googleSignInButton');
            if (buttonContainer) {
                // Clear previous button
                buttonContainer.innerHTML = '';

                // Render with theme-appropriate styling
                window.google.accounts.id.renderButton(
                    buttonContainer,
                    {
                        theme: theme === 'dark' ? 'filled_black' : 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'pill',
                        width: 360, // Fixed width for consistency
                        logo_alignment: 'left',
                    }
                );
            }
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

    return (
        <div className="mt-6">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                <span className={`text-sm font-medium transition-colors duration-500 ${colors.subText}`}>
                    OR
                </span>
                <div className={`flex-1 h-px transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
            </div>

            {/* Google Button Container */}
            <div className="relative w-full flex justify-center items-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl z-10 backdrop-blur-sm">
                        <Loader className="animate-spin text-blue-500" size={28} />
                    </div>
                )}
                <div
                    id="googleSignInButton"
                    className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
                        }`}
                    style={{
                        width: '100%',
                        maxWidth: '360px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                ></div>
            </div>

            {/* Styling adjustments for Google button */}
            <style>{`
                #googleSignInButton > div {
                    margin: 0 auto !important;
                }
                
                #googleSignInButton iframe {
                    margin: 0 auto !important;
                }

                /* Dark theme adjustments */
                ${theme === 'dark' ? `
                    #googleSignInButton {
                        filter: brightness(0.95);
                    }
                    #googleSignInButton:hover {
                        filter: brightness(1.05);
                    }
                ` : ''}
            `}</style>
        </div>
    );
};

export default GoogleSignIn;