import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import {
  X,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, continueAsGuest } = useAuth();
  const { addToast } = useDocuments();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'login') {
      await login(email, password);
      addToast('Signed in to PDF Studio', 'success');
      onClose();
    } else if (mode === 'signup') {
      await signup(name || 'User', email, password);
      addToast('Account created! Welcome to PDF Studio', 'success');
      onClose();
    } else {
      setIsSubmitted(true);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    addToast('Continuing in Guest Mode', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              PS
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {mode === 'login'
                ? 'Sign In to PDF Studio'
                : mode === 'signup'
                ? 'Create Your Workspace'
                : 'Reset Password'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-5">
          {mode === 'login'
            ? 'Sign in to access your personal PDF library and recovery vault.'
            : mode === 'signup'
            ? 'Automatic cloud library, version history, and recovery vault.'
            : 'Enter your email address to receive password reset instructions.'}
        </p>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="text-sm font-bold text-emerald-900">Password Reset Sent</div>
            <p className="text-xs text-emerald-700">
              Check your inbox for a link to reset your password.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setMode('login');
              }}
              className="mt-3 text-xs font-semibold text-emerald-800 underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name:</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address:</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password:</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {mode === 'login'
                ? 'Sign In'
                : mode === 'signup'
                ? 'Create Account'
                : 'Send Reset Link'}
            </button>

            {/* Quick Demo Fill Button */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setName('Alex Morgan');
                  setEmail('alex.morgan@pdfstudio.app');
                  setPassword('demo1234');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline"
              >
                Auto-fill demo credentials
              </button>
            </div>
          </form>
        )}

        {/* Guest Mode & Switch Mode Options */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-center text-xs">
          {mode === 'login' ? (
            <div>
              <span className="text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-rose-600 hover:underline"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div>
              <span className="text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-rose-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          )}

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase">or</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Continue as Guest (No Account Required)
          </button>
        </div>
      </div>
    </div>
  );
};
