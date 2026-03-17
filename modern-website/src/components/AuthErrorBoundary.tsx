"use client";

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
    children: ReactNode;
    onRetry?: () => void;
    onClearSession?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class AuthErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🚨 Auth Error Boundary caught an error:', error);
        console.error('Error Info:', errorInfo);
        
        this.setState({
            error,
            errorInfo
        });
    }

    handleRetry = () => {
        console.log('🔄 Retrying auth restoration...');
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        
        if (this.props.onRetry) {
            this.props.onRetry();
        }
    };

    handleClearSession = () => {
        console.log('🧹 Clearing session and redirecting to login...');
        
        // Clear all auth-related localStorage items
        localStorage.removeItem('beezee_business_auth');
        localStorage.removeItem('beezee_direct_auth');
        localStorage.removeItem('sessionData');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('beezee_simple_auth');
        
        if (this.props.onClearSession) {
            this.props.onClearSession();
        } else {
            // Default behavior: redirect to login
            window.location.href = '/Beezee-App/auth/login';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-3xl border border-red-200 shadow-lg p-8">
                            {/* Error Icon */}
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>

                            {/* Error Message */}
                            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
                                Authentication Error
                            </h1>
                            <p className="text-gray-600 text-center mb-6">
                                We encountered an issue while restoring your session. This might be due to corrupted data or a temporary glitch.
                            </p>

                            {/* Error Details (for debugging) */}
                            {this.state.error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <p className="text-xs font-mono text-red-800 break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            {/* Recovery Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleRetry}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Retry
                                </button>

                                <button
                                    onClick={this.handleClearSession}
                                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Clear Session & Login
                                </button>
                            </div>

                            {/* Help Text */}
                            <p className="text-xs text-gray-500 text-center mt-6">
                                If this problem persists, try clearing your browser cache or contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
