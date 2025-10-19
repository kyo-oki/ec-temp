import { ReactNode, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Menu,
  Store,
  Package,
  ShoppingCart,
  FileText,
  HelpCircle,
  Info,
  MessageSquare,
  Tag,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { storeId } = useParams<{ storeId: string }>();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  const navigation = [
    { name: "Dashboard", href: `/stores/${storeId}/admin`, icon: Store },
    {
      name: "Products",
      href: `/stores/${storeId}/admin/products`,
      icon: Package,
    },
    {
      name: "Orders",
      href: `/stores/${storeId}/admin/orders`,
      icon: ShoppingCart,
    },
    { name: "Blog", href: `/stores/${storeId}/admin/blog`, icon: FileText },
    { name: "FAQs", href: `/stores/${storeId}/admin/faq`, icon: HelpCircle },
    { name: "About", href: `/stores/${storeId}/admin/about`, icon: Info },
    {
      name: "Contact",
      href: `/stores/${storeId}/admin/contacts`,
      icon: MessageSquare,
    },
    {
      name: "Promotions",
      href: `/stores/${storeId}/admin/promotions`,
      icon: Tag,
    },
    { name: "Settings", href: `/stores/${storeId}/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
                Store Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Store
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
