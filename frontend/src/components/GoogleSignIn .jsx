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
                locale: 'en',
            });

            const buttonContainer = document.getElementById('googleSignInButton');
            if (buttonContainer) {
                // Clear previous button
                buttonContainer.innerHTML = '';

                // Render custom styled button
                window.google.accounts.id.renderButton(
                    buttonContainer,
                    {
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        width: 400,
                        logo_alignment: 'left',
                        locale: 'en',
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

            {/* Google Button Container with custom styling */}
            <div className="relative w-full flex justify-center items-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl z-10 backdrop-blur-sm">
                        <Loader className="animate-spin text-blue-500" size={28} />
                    </div>
                )}
                <div
                    id="googleSignInButton"
                    className={`transition-opacity duration-300 w-full ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
                        }`}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                ></div>
            </div>

            {/* Custom styling to make Google button look like login button */}
            <style>{`
                /* Container styling */
                #googleSignInButton > div {
                    margin: 0 auto !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                #googleSignInButton iframe {
                    margin: 0 auto !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }

                /* Custom button styling to match login button */
                #googleSignInButton > div > div {
                    border-radius: 0.75rem !important; /* rounded-xl */
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important; /* shadow-lg */
                    transition: all 0.3s ease !important;
                    border: 2px solid ${theme === 'dark' ? '#374151' : '#d1d5db'} !important; /* border-2 */
                    background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'} !important;
                    overflow: hidden !important;
                }

                /* Hover effect - scale up */
                #googleSignInButton > div > div:hover {
                    transform: scale(1.02) !important;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important; /* shadow-xl */
                    border-color: ${theme === 'dark' ? '#4b5563' : '#9ca3af'} !important;
                    background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'} !important;
                }

                /* Active effect - scale down */
                #googleSignInButton > div > div:active {
                    transform: scale(0.98) !important;
                }

                /* Make iframe fill container properly */
                #googleSignInButton iframe {
                    border-radius: 0.75rem !important;
                }

                /* Dark theme adjustments */
                ${theme === 'dark' ? `
                    #googleSignInButton > div > div {
                        filter: brightness(0.95);
                    }
                    #googleSignInButton > div > div:hover {
                        filter: brightness(1.05);
                    }
                ` : ''}

                /* Smooth transitions */
                #googleSignInButton * {
                    transition: all 0.3s ease !important;
                }

                /* Mobile responsive */
                @media (max-width: 640px) {
                    #googleSignInButton > div,
                    #googleSignInButton iframe {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default GoogleSignIn;