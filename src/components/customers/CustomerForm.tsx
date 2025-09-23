import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface CustomerFormProps {
  customer?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    phoneNumber: customer?.phoneNumber || '',
    email: customer?.email || '',
  });

  const saveMutation = useApiMutation(
    (data: any) => customer 
      ? apiService.updateCustomer(customer.id, data)
      : apiService.createCustomer(data),
    {
      onSuccess: () => onSuccess(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
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
        label="Phone Number *"
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        required
        placeholder="+1-555-0123"
        helperText="Include country code for best results"
      />

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="customer@example.com"
        helperText="Optional - used for receipts and communication"
      />

      {saveMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {saveMutation.error}
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" isLoading={saveMutation.isLoading}>
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}