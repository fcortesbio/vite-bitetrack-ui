import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Crown, Shield, UserPlus, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { PendingSellerForm } from './PendingSellerForm';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

export function SellersView() {
  const { isSuperAdmin } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const data = await apiService.getSellers();
      setSellers(data);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const recoverPasswordMutation = useApiMutation(
    (sellerId: string) => apiService.recover(sellerId),
    {
      onSuccess: (data) => {
        alert(`Password reset token generated: ${data.token}\nThis token expires at: ${new Date(data.expiresAt).toLocaleString()}`);
      },
    }
  );

  const filteredSellers = sellers.filter((seller: any) =>
    `${seller.firstName} ${seller.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPendingSeller = () => {
    setShowModal(true);
  };

  const handlePasswordRecovery = (seller: any) => {
    if (window.confirm(`Generate password reset token for ${seller.firstName} ${seller.lastName}?`)) {
      recoverPasswordMutation.mutate(seller.id);
    }
  };

  const handleSellerCreated = () => {
    setShowModal(false);
    fetchSellers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Seller Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <Button onClick={handleNewPendingSeller} className="flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Create Pending Seller
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sellers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sellers List */}
      {filteredSellers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first pending seller'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewPendingSeller}>
                <UserPlus className="w-4 h-4 mr-2" />
                Create First Pending Seller
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSellers.map((seller: any) => (
            <Card key={seller.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(seller.role)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {seller.firstName} {seller.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(seller.role)}`}>
                        {seller.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{seller.email}</span>
                      <span>Joined {new Date(seller.activatedAt || seller.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isSuperAdmin && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePasswordRecovery(seller)}
                      isLoading={recoverPasswordMutation.isLoading}
                      className="flex items-center"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset Password
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Pending Seller Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Pending Seller"
      >
        <PendingSellerForm
          onSuccess={handleSellerCreated}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}