import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Zap, ShoppingCart, Calendar, Wrench, Package, Shield, Heart, Phone } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Zap },
    { path: '/test-ride', label: 'Test Ride', icon: Calendar, authRequired: true },
    { path: '/service', label: 'Service', icon: Wrench, authRequired: true },
    { path: '/my-orders', label: 'My Orders', icon: Package, authRequired: true },
    { path: '/my-bookings', label: 'My Bookings', icon: ShoppingCart, authRequired: true },
    { path: '/contact', label: 'Contact Us', icon: Phone },
    { path: '/admin', label: 'Admin', icon: Shield, authRequired: true },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        if (item.authRequired && !isAuthenticated) return null;
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate({ to: item.path });
              if (mobile) setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            } ${mobile ? 'w-full justify-start' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/assets/generated/ezyride-logo-transparent.dim_200x200.png" 
                alt="Ezyride Logo" 
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent">
                  Ezyride
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Bhavishya ki Sawari</span>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={!isAuthenticated ? 'bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90' : ''}
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/assets/generated/ezyride-logo-transparent.dim_200x200.png" 
                  alt="Ezyride Logo" 
                  className="w-8 h-8"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Ezyride</span>
                  <span className="text-sm text-muted-foreground -mt-1">Bhavishya ki Sawari</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Leading the electric revolution with sustainable, high-performance scooters.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate({ to: '/' })} className="hover:text-foreground transition-colors">
                    Browse Models
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate({ to: '/test-ride' })} className="hover:text-foreground transition-colors">
                    Book Test Ride
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate({ to: '/service' })} className="hover:text-foreground transition-colors">
                    Service Booking
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate({ to: '/contact' })} className="hover:text-foreground transition-colors">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Mobile: 7005626159</li>
                <li>Email: manrales12@gmail.com</li>
                <li>Support: 24/7 Available</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © 2025. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
