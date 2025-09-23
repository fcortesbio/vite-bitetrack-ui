import React, { useState } from 'react';
import { UserCheck, ArrowLeft, Eye, EyeOff, Calendar, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface ActivationPageProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function ActivationPage({ email, onBack, onSuccess }: ActivationPageProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const activationMutation = useApiMutation(
    (data: any) => apiService.activate(data),
    {
      onSuccess: () => onSuccess(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    activationMutation.mutate({
      email,
      dateOfBirth: formData.dateOfBirth,
      lastName: formData.lastName,
      password: formData.password,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Activate Your Account</h2>
              <p className="text-gray-600">Complete your profile to get started</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Pending account:</strong> {email}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Please provide the required information to activate your account
            </p>
          </div>

          {/* Activation Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="date"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
                helperText="Must match the date provided when your account was created"
              />
              <Calendar className="absolute right-3 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                helperText="Must match the name on your account"
              />
              <User className="absolute right-3 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                helperText="8+ characters with uppercase, lowercase, numbers, and symbols"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {activationMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {activationMutation.error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="success"
              isLoading={activationMutation.isLoading}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Activate Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}