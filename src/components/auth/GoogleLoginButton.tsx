import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { GoogleIcon, GoogleLoginModal } from './GoogleLoginModal';

interface GoogleLoginButtonProps {
  role?: UserRole;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  className?: string;
}

// Decode JWT token from Google Identity Services
function decodeJwtResponse(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  role = 'student',
  text = 'continue_with',
  className = ''
}) => {
  const { loginWithGoogle } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Google Identity Services if client ID is present
  useEffect(() => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const win = window as any;
    if (win.google?.accounts?.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              const payload = decodeJwtResponse(response.credential);
              if (payload && payload.email) {
                loginWithGoogle({
                  name: payload.name || payload.given_name || 'Google User',
                  email: payload.email,
                  avatarUrl: payload.picture,
                  role
                });
              }
            }
          }
        });
      } catch (err) {
        console.warn('Google GSI initialization warning:', err);
      }
    }
  }, [role, loginWithGoogle]);

  const handleClick = () => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    const win = window as any;

    if (clientId && win.google?.accounts?.id) {
      try {
        win.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to interactive modal
            setIsModalOpen(true);
          }
        });
        return;
      } catch {
        setIsModalOpen(true);
        return;
      }
    }

    // Default seamless Google chooser
    setIsModalOpen(true);
  };

  const getButtonText = () => {
    if (text === 'signup_with') return 'Sign up with Google';
    if (text === 'signin_with') return 'Sign in with Google';
    return 'Continue with Google';
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99] ${className}`}
      >
        <GoogleIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
        <span>{getButtonText()}</span>
      </button>

      <GoogleLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultRole={role}
      />
    </>
  );
};
