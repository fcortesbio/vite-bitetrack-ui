import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, Package, TrendingUp, Plus, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

interface DashboardProps {
  onNewSale: () => void;
}

export function Dashboard({ onNewSale }: DashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    totalProducts: 0,
    recentSales: 0,
    hasProducts: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customers, products, sales] = await Promise.all([
          apiService.getCustomers(),
          apiService.getProducts(),
          apiService.getSales(),
        ]);

        const totalInventory = products.reduce((sum: number, product: any) => sum + product.count, 0);

        setStats({
          customers: customers.length,
          products: products.length,
          totalProducts: totalInventory,
          recentSales: sales.length,
          hasProducts: products.length > 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{stats.customers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Products</p>
              <p className="text-2xl font-bold">{stats.products}</p>
            </div>
            <Package className="w-8 h-8 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Inventory</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Sales</p>
              <p className="text-2xl font-bold">{stats.recentSales}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-200" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Sale Section */}
        <Card title="Quick Actions" subtitle="Manage your daily operations">
          <div className="space-y-4">
            {!stats.hasProducts ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      No products available
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Add some products to your inventory before creating sales.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <Button
              onClick={onNewSale}
              size="lg"
              className="w-full justify-start"
              disabled={!stats.hasProducts}
              variant={stats.hasProducts ? "primary" : "secondary"}
            >
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">New Sale</div>
                <div className="text-xs opacity-75">
                  {stats.hasProducts ? 'Create a new transaction' : 'Add products first'}
                </div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="System Status" subtitle="Everything you need to know">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Products in catalog</span>
              <span className="font-medium">{stats.products}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Total inventory items</span>
              <span className="font-medium">{stats.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Registered customers</span>
              <span className="font-medium">{stats.customers}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Account role</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}