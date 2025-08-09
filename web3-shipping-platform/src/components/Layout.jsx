import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Store, 
  Truck, 
  Package, 
  Settings, 
  Menu, 
  X,
  RotateCcw,
  Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import idevLogo from '../assets/3.jpg';
import '../App.css';

const Layout = ({ children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const navigationItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'store', label: t('store_dashboard'), icon: Store },
    { id: 'driver', label: t('driver_dashboard'), icon: Truck },
    { id: 'tracking', label: t('track_shipment'), icon: Package },
    { id: 'returns', label: t('returns_management'), icon: RotateCcw },
    { id: 'coordination', label: t('shipping_coordination'), icon: Globe },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen starry-bg">
      {/* Header */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-primary hover:bg-primary/10"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <img 
              src={idevLogo} 
              alt="IDEV Logo" 
              className="h-12 w-12 rounded-full idev-logo"
            />
            <div className="arabic-text">
              <h1 className="text-xl font-bold gradient-text">IDEV</h1>
              <p className="text-sm text-muted-foreground">منصة الشحن والتوصيل</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className={`arabic-text ${
                    currentView === item.id 
                      ? 'btn-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-primary/10'
                  }`}
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 right-0 z-40 w-64 
          transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
          glass-card border-l border-primary/20 md:border-l-0 md:border-r
        `}>
          <div className="p-4 space-y-2 mt-16 md:mt-0">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onViewChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full justify-start arabic-text ${
                    currentView === item.id 
                      ? 'btn-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-primary/10'
                  }`}
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

