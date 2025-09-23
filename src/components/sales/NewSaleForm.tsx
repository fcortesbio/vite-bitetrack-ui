import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

interface NewSaleFormProps {
  customers: any[];
  products: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface SaleItem {
  productId: string;
  quantity: number;
}

export function NewSaleForm({ customers, products, onSuccess, onCancel }: NewSaleFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [amountPaid, setAmountPaid] = useState('');

  const createSaleMutation = useApiMutation(
    (data: any) => apiService.createSale(data),
    {
      onSuccess: () => onSuccess(),
    }
  );

  const addItem = () => {
    setItems(prev => [...prev, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || items.length === 0) {
      return;
    }

    const validItems = items.filter(item => item.productId && item.quantity > 0);
    
    if (validItems.length === 0) {
      return;
    }

    createSaleMutation.mutate({
      customerId,
      products: validItems,
      amountPaid: parseFloat(amountPaid) || 0,
    });
  };

  const total = calculateTotal();
  const paidAmount = parseFloat(amountPaid) || 0;
  const balance = total - paidAmount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer *
        </label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName} - {customer.phoneNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Items *
          </label>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.productName} - ${product.price.toFixed(2)} ({product.count} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-medium text-gray-700 w-20 text-right">
                ${item.productId ? 
                  ((products.find(p => p.id === item.productId)?.price || 0) * item.quantity).toFixed(2) :
                  '0.00'
                }
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet.</p>
              <Button type="button" onClick={addItem} size="sm" className="mt-2">
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment */}
      <div>
        <Input
          type="number"
          step="0.01"
          min="0"
          label="Amount Paid"
          placeholder="0.00"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
        />
      </div>

      {/* Summary */}
      {total > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Amount Paid:</span>
            <span>${paidAmount.toFixed(2)}</span>
          </div>
          <div className={`flex justify-between items-center font-semibold ${
            balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-900'
          }`}>
            <span>Balance:</span>
            <span>${balance.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {createSaleMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {createSaleMutation.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={createSaleMutation.isLoading}
          disabled={!customerId || items.length === 0}
        >
          Create Sale
        </Button>
      </div>
    </form>
  );
}