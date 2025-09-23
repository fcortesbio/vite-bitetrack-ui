import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    productName: product?.productName || '',
    description: product?.description || '',
    count: product?.count?.toString() || '',
    price: product?.price?.toString() || '',
  });

  const saveMutation = useApiMutation(
    (data: any) => {
      const payload = {
        ...data,
        count: parseInt(data.count),
        price: parseFloat(data.price),
      };
      return product 
        ? apiService.updateProduct(product.id, payload)
        : apiService.createProduct(payload);
    },
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
      <Input
        label="Product Name *"
        value={formData.productName}
        onChange={(e) => handleInputChange('productName', e.target.value)}
        required
        placeholder="Enter product name"
        helperText="Use a clear, descriptive name for your product"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter product description (optional)"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional - provide details about ingredients, preparation, etc.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity in Stock *"
          type="number"
          min="0"
          value={formData.count}
          onChange={(e) => handleInputChange('count', e.target.value)}
          required
          placeholder="0"
          helperText="Current inventory count"
        />
        
        <Input
          label="Price *"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          required
          placeholder="0.00"
          helperText="Price per unit in dollars"
        />
      </div>

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
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}