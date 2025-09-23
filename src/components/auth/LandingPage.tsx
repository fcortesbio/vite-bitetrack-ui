import React, { useState } from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface LandingPageProps {
  onStatusCheck: (email: string, status: 'active' | 'pending') => void;
}

export function LandingPage({ onStatusCheck }: LandingPageProps) {
  const [email, setEmail] = useState('');

  const checkStatusMutation = useApiMutation(
    (email: string) => apiService.checkSellerStatus(email),
    {
      onSuccess: (data) => onStatusCheck(email, data.status),
      onError: (error) => {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          alert('No account found for this email address. Please contact your administrator.');
        }
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      checkStatusMutation.mutate(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BiteTrack</h1>
          <p className="text-gray-600">Transform your food business management</p>
        </div>

        {/* Email Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={checkStatusMutation.error}
                helperText="We'll check if you have an account and guide you accordingly"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={checkStatusMutation.isLoading}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? Contact your administrator to get started.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                📊
              </div>
              Sales Tracking
            </div>
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                📦
              </div>
              Inventory
            </div>
            <div className="text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                👥
              </div>
              Customers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}