import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { ActivationPage } from './components/auth/ActivationPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SalesView } from './components/sales/SalesView';
import { CustomersView } from './components/customers/CustomersView';
import { ProductsView } from './components/products/ProductsView';
import { SellersView } from './components/sellers/SellersView';
import { Sidebar } from './components/Layout/Sidebar';

type AuthStep = 'landing' | 'login' | 'activate' | 'success';
type View = 'dashboard' | 'sales' | 'customers' | 'products' | 'sellers' | 'settings';

function AuthFlow() {
  const [authStep, setAuthStep] = useState<AuthStep>('landing');
  const [tempEmail, setTempEmail] = useState('');

  const handleStatusCheck = (email: string, status: 'active' | 'pending') => {
    setTempEmail(email);
    setAuthStep(status === 'active' ? 'login' : 'activate');
  };

  const handleActivationSuccess = () => {
    setAuthStep('success');
    // Auto-redirect to login after 3 seconds
    setTimeout(() => {
      setAuthStep('login');
    }, 3000);
  };

  switch (authStep) {
    case 'landing':
      return <LandingPage onStatusCheck={handleStatusCheck} />;
    
    case 'login':
      return (
        <LoginPage 
          email={tempEmail} 
          onBack={() => setAuthStep('landing')}
        />
      );
    
    case 'activate':
      return (
        <ActivationPage 
          email={tempEmail} 
          onBack={() => setAuthStep('landing')}
          onSuccess={handleActivationSuccess}
        />
      );
    
    case 'success':
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Activated! 🎉</h2>
              <p className="text-gray-600 mb-4">
                Your account has been successfully activated. 
                You'll be redirected to login shortly...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            </div>
          </div>
        </div>
      );
    
    default:
      return <LandingPage onStatusCheck={handleStatusCheck} />;
  }
}

function MainApp() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNewSale={() => setActiveView('sales')} />;
      case 'sales':
        return <SalesView />;
      case 'customers':
        return <CustomersView />;
      case 'products':
        return <ProductsView />;
      case 'sellers':
        return isAdmin ? <SellersView /> : <Dashboard onNewSale={() => setActiveView('sales')} />;
      case 'settings':
        return <Dashboard onNewSale={() => setActiveView('sales')} />;
      default:
        return <Dashboard onNewSale={() => setActiveView('sales')} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;