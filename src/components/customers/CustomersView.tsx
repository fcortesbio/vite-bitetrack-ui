import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Phone, Mail, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { CustomerForm } from './CustomerForm';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

export function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerMutation = useApiMutation(
    (id: string) => apiService.deleteCustomer(id),
    {
      onSuccess: () => {
        fetchCustomers();
      },
    }
  );

  const filteredCustomers = customers.filter((customer: any) =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customer: any) => {
    if (window.confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
      deleteCustomerMutation.mutate(customer.id);
    }
  };

  const handleCustomerSaved = () => {
    setShowModal(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Management</h1>
          <p className="text-gray-600">Manage your customer database and contact information</p>
        </div>
        <Button onClick={handleNewCustomer} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Customer
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first customer'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewCustomer}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Customer
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer: any) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Added {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    disabled={deleteCustomerMutation.isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{customer.phoneNumber}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{customer.email}</span>
                  </div>
                )}
                {customer.lastTransaction && (
                  <div className="text-sm text-gray-500">
                    Last purchase: {new Date(customer.lastTransaction).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSuccess={handleCustomerSaved}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}