import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ProductForm } from './ProductForm';
import { apiService } from '../../services/api';
import { useApiMutation } from '../../hooks/useApiMutation';

export function ProductsView() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProductMutation = useApiMutation(
    (id: string) => apiService.deleteProduct(id),
    {
      onSuccess: () => {
        fetchProducts();
      },
    }
  );

  const filteredProducts = products.filter((product: any) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (product: any) => {
    if (window.confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleProductSaved = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Product Management</h1>
          <p className="text-gray-600">Manage your inventory, pricing, and product catalog</p>
        </div>
        <Button onClick={handleNewProduct} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first product'}
            </p>
            {!searchTerm && (
              <Button onClick={handleNewProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{product.productName}</h3>
                    {product.count <= 5 && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" title="Low stock" />
                    )}
                  </div>
                  <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    disabled={deleteProductMutation.isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-medium ${
                    product.count <= 5 ? 'text-amber-600' : 'text-gray-700'
                  }`}>
                    {product.count} in stock
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.count > 10 
                    ? 'bg-green-100 text-green-800'
                    : product.count > 5
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.count > 10 ? 'In Stock' : product.count > 5 ? 'Low Stock' : 'Very Low'}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Updated {new Date(product.updatedAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <ProductForm
          product={editingProduct}
          onSuccess={handleProductSaved}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}