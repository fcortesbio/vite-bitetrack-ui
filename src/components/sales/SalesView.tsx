import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, User, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { NewSaleForm } from './NewSaleForm';
import { apiService } from '../../services/api';

export function SalesView() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesData, customersData, productsData] = await Promise.all([
        apiService.getSales(),
        apiService.getCustomers(),
        apiService.getProducts(),
      ]);
      
      setSales(salesData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c: any) => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const filteredSales = sales.filter((sale: any) => {
    const customerName = getCustomerName(sale.customerId).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase());
  });

  const handleNewSale = () => {
    setShowNewSaleModal(true);
  };

  const handleSaleCreated = () => {
    setShowNewSaleModal(false);
    fetchData();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sales Management</h1>
          <p className="text-gray-600">Track and manage all your sales transactions</p>
        </div>
        <Button
          onClick={handleNewSale}
          disabled={products.length === 0}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first sale'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewSale} disabled={products.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Sale
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSales.map((sale: any) => (
            <Card key={sale.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {getCustomerName(sale.customerId)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.settled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sale.settled ? 'Settled' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>
                          {sale.products.length} item{sale.products.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${sale.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Paid: ${sale.amountPaid.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Sale Modal */}
      <Modal
        isOpen={showNewSaleModal}
        onClose={() => setShowNewSaleModal(false)}
        title="Create New Sale"
        maxWidth="lg"
      >
        <NewSaleForm
          customers={customers}
          products={products}
          onSuccess={handleSaleCreated}
          onCancel={() => setShowNewSaleModal(false)}
        />
      </Modal>
    </div>
  );
}