import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface PendingSellerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PendingSellerForm({ onSuccess, onCancel }: PendingSellerFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });

  const createMutation = useApiMutation(
    (data: any) => apiService.createPendingSeller(data),
    {
      onSuccess: () => onSuccess(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Creating a Pending Seller Account</h4>
        <p className="text-sm text-blue-800">
          This will create a pending account that the user can activate later. They will need to provide:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
          <li>The exact email address you specify</li>
          <li>The exact date of birth you specify</li>
          <li>The exact last name you specify</li>
          <li>A new secure password of their choice</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
            placeholder="Enter first name"
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
            placeholder="Enter last name"
          />
        </div>

        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          placeholder="user@example.com"
          helperText="This will be their login email address"
        />

        <Input
          label="Date of Birth *"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          required
          helperText="Required for account verification during activation"
        />

        {createMutation.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {createMutation.error}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isLoading}>
            Create Pending Seller
          </Button>
        </div>
      </form>
    </div>
  );
}